import { count, sum } from '../util/collection';
import { Collector } from './Collector';
import { Facing, Location, Point } from './Location';
import { isEndSquare, isStartSquare, isValidLetter, RasterMap, Square } from './RasterMap';

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

function isValidVerticalSquare(square: Square): boolean {
  return ['|', '+'].includes(square) || isValidLetter(square) || isEndSquare(square);
}

function isValidHorizontalSquare(square: Square): boolean {
  return ['-', '+'].includes(square) || isValidLetter(square) || isEndSquare(square);
}

function isAnyDirectionSquare(square: Square): boolean {
  return square === '+' || isValidLetter(square) || isStartSquare(square) || isEndSquare(square);
}

export function isValidLocation(rasterMap: RasterMap, location: Location, fromLocation: Location): boolean {
  if (location.point[0] < 0 || location.point[0] >= rasterMap.length) {
    return false;
  }

  const row = rasterMap[location.point[0]];

  if (location.point[1] < 0 || location.point[1] >= row.length) {
    return false;
  }

  // We moved more than a square. This is technically not exhaustive, as a move of (-2, 1) would satisfy it, but let's not over-complicate
  if (Math.abs(fromLocation.point[0] - location.point[0]) + Math.abs(fromLocation.point[1] - location.point[1]) !== 1) {
    return false;
  }

  const locationSquare = location.on(rasterMap)!;

  if (isAnyDirectionSquare(fromLocation.on(rasterMap)!)) {
    return isValidVerticalSquare(locationSquare) || isValidHorizontalSquare(locationSquare);
  }

  switch (fromLocation.facing) {
    case Facing.Down:
    case Facing.Up:
      return isValidVerticalSquare(locationSquare);
    case Facing.Left:
    case Facing.Right:
      return isValidHorizontalSquare(locationSquare);
    default:
      throw new Error(`Invalid facing ${fromLocation.facing}`);
  }
}

export function getPossibleNextLocations(rasterMap: RasterMap, location: Location): Location[] {
  const currentSquare = location.on(rasterMap)!;

  if (isValidLocation(rasterMap, location.next, location)) {
    return [location.next];
  }

  if (isAnyDirectionSquare(currentSquare)) {
    // Any direction where we don't literally turn back is a valid location when we're on a crossroads
    return location.neighbours.filter((n) => n.facing !== location.oppositeFacing);
  } else if (isValidVerticalSquare(currentSquare)) {
    return location.facing === Facing.Up ? [location.up] : [location.down];
  } else if (isValidHorizontalSquare(currentSquare)) {
    return location.facing === Facing.Right ? [location.right] : [location.left];
  } else {
    throw new Error(`Cannot navigate from invalid square ${currentSquare} at location (${location.point[0]}, ${location.point[1]})`);
  }
}

export function getNextLocation(rasterMap: RasterMap, location: Location): Location {
  const candidates = getPossibleNextLocations(rasterMap, location).filter((neighbour) => isValidLocation(rasterMap, neighbour, location));
  if (candidates.length !== 1) {
    throw new Error(`Expected exactly 1 potential future location, got ${candidates.length}`);
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
