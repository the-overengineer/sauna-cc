import { count, sum } from '../util/collection';
import { Collector } from './Collector';
import { Facing, Location, Point } from './Location';
import {
  isAnyDirectionSquare,
  isCrossroads,
  isEndSquare,
  isSquare,
  isStartSquare,
  isValidHorizontalSquare,
  isValidLetter,
  isValidVerticalSquare,
  RasterMap,
} from './RasterMap';

/**
 * Determines whether a map has both valid endpoints - a start and an end - and only one of each.
 * A map which does not satisfy these conditions is considered invalid, because there could be more
 * than one path through it.
 *
 * @param map A raster representation of a map
 */
export function hasValidEndpoints(rasterMap: RasterMap): boolean {
  const startSquareCount = sum(rasterMap.map((row) => count(row, isStartSquare)));
  const endSquareCount = sum(rasterMap.map((row) => count(row, isEndSquare)));

  return startSquareCount === 1 && endSquareCount === 1;
}

export function getPossibleNextLocations(rasterMap: RasterMap, location: Location): Location[] {
  const currentSquare = location.on(rasterMap)!;

  /*
  * Determine the next valid squares that we could walk to from here. The logic is as follows:
  * 1. If we are not in a crossroads square (+, or theoretically @), just power through it forwards. We can cross opposite-direction squares
  *    if we eventually get to a valid square with the same facing (underpass of sorts)
  * 2. If we're in a letter, prefer going straight. But if it does not work, allow turning left or right
  * 3. If we're in a crossroads square (+ or @), anything but going backwards is fine
  */
  if (!isCrossroads(currentSquare) && !isValidLetter(currentSquare)) {
    if (location.walkUntil(rasterMap, (square) => location.matchesFacing(square)) != null) {
      return [location.next];
    }
  } else if (isValidLetter(currentSquare)) {
    if (location.walkUntil(rasterMap, (square) => location.matchesFacing(square)) != null) {
      return [location.next];
    } else {
      // Anything that would result in a valid square in a different direction on the vertical/horizontal scale
      // We can consider it the same as turning left/right
      return location
        .neighbours
        .filter((neighbour) => neighbour.isVertical !== location.isVertical);
    }
  } else {
    return location
      .neighbours
      .filter((n) => n.facing !== location.oppositeFacing && isSquare(n.on(rasterMap)!) && n.matchesFacing(n.on(rasterMap)!));
  }

  return [];
}

export function getNextLocation(rasterMap: RasterMap, location: Location): Location {
  const candidates = getPossibleNextLocations(rasterMap, location);
  if (candidates.length !== 1) {
    throw new Error(`Expected exactly 1 potential future location, got ${candidates.length}: (${candidates.map((c) => `(${c.point})`).join(', ')})`);
  }

  return candidates[0]!;
}

export function findStartLocation(rasterMap: RasterMap): Location {
  for (let i = 0; i < rasterMap.length; i++) {
    const row = rasterMap[i];
    for (let j = 0; j < row.length; j++) {
      const square = rasterMap[i][j];

      if (isStartSquare(square)) {
        const startPoint: Point = [i, j];

        /*
        * What we do here is abuse the point logic. A virtual point is created with an arbitrary facing
        * and then we find a possible path to go from there.
        */
       const virtualPoint = new Location(startPoint, Facing.Left);
       const nextPoints = virtualPoint.neighbours.filter((neighbour) => {
         const facingToNeighbour = virtualPoint.facingTo(neighbour.point);
         const neighbourSquare = neighbour.on(rasterMap);

         if (neighbourSquare == null) {
           return false;
         }

         if (facingToNeighbour === Facing.Up || facingToNeighbour === Facing.Down) {
           return isValidVerticalSquare(neighbourSquare);
         } else {
           return isValidHorizontalSquare(neighbourSquare);
         }
       });

       if (nextPoints.length !== 1) {
         throw new Error(`Invalid initial facings found, cannot find a singular path!`);
       }

       return new Location(startPoint, virtualPoint.facingTo(nextPoints[0]!.point));
      }
    }
  }

  throw new Error('Could not find a valid initial starting point and facing!');
}

export function walk(rasterMap: RasterMap): Collector {
  if (!hasValidEndpoints(rasterMap)) {
    throw new Error(`Invalid raster map provided. A map needs to have exactly one start (@) and end (x) point, and all squares must be valid or empty`);
  }

  const collector = new Collector();
  let currentLocation = findStartLocation(rasterMap);

  while (true) {
    const currentSquare = currentLocation.on(rasterMap)!;

    collector.visit(currentSquare);
    if (isEndSquare(currentSquare)) {
      return collector;
    }

    currentLocation = getNextLocation(rasterMap, currentLocation);
  }
}
