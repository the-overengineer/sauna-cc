import { count, sum } from '../util/collection';
import { Facing, Location } from './Location';
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
  return square === '+' || isValidLetter(square) || isEndSquare(square);

}

export function isValidLocation(rasterMap: RasterMap, location: Location, fromFacing: Facing): boolean {
  if (location.point[0] < 0 || location.point[0] >= rasterMap.length) {
    return false;
  }

  const row = rasterMap[location.point[0]];

  if (location.point[1] < 0 || location.point[1] >= row.length) {
    return false;
  }

  const locationSquare = rasterMap[location.point[0]][location.point[1]];

  switch (fromFacing) {
    case Facing.Down:
    case Facing.Up:
      return isValidVerticalSquare(locationSquare);
    case Facing.Left:
    case Facing.Right:
      return isValidHorizontalSquare(locationSquare);
    default:
      throw new Error(`Invalid facing ${fromFacing}`);
  }
}

export function getPossibleNextLocations(rasterMap: RasterMap, location: Location): Location[] {
  const currentSquare = rasterMap[location.point[0]][location.point[1]];

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
  const candidates = getPossibleNextLocations(rasterMap, location);

  if (candidates.length !== 1) {
    throw new Error(`Expected exactly 1 potential future location, got ${candidates.length}`);
  }

  return candidates[0]!;
}
