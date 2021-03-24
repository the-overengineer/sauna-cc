import {
  isSquare,
  isValidHorizontalSquare,
  isValidVerticalSquare,
  RasterMap,
  Square,
} from './RasterMap';

type Index = number;

export enum Facing {
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Left = 'Left',
}

/**
 * A point in a raster, as [row, column], 0-indexed.
 */
export type Point = [Index, Index];

/**
 * A location in a raster map, consisting of the current location and current cardinal facing.
 *
 * It does contain some domain logic - namely, it has information about types of valid squares.
 * It is not a domain-agnostic implementation of position in a raster of any type.
 */
export class Location {
  public constructor(
    public readonly point: Point,
    public readonly facing: Facing,
  ) {}

  public get up(): Location {
    return new Location(
      [this.point[0] - 1, this.point[1]],
      Facing.Up,
    );
  }

  public get right(): Location {
    return new Location(
      [this.point[0], this.point[1] + 1],
      Facing.Right,
    );
  }

  public get down(): Location {
    return new Location(
      [this.point[0] + 1, this.point[1]],
      Facing.Down,
    );
  }

  public get left(): Location {
    return new Location(
      [this.point[0], this.point[1] - 1],
      Facing.Left,
    );
  }

  public get neighbours(): Location[] {
    return [this.up, this.right, this.down, this.left];
  }

  public get oppositeFacing(): Facing {
    switch (this.facing) {
      case Facing.Up: return Facing.Down;
      case Facing.Right: return Facing.Left;
      case Facing.Down: return Facing.Up;
      case Facing.Left: return Facing.Right;
    }
  }

  public get isVertical(): boolean {
    return [Facing.Up, Facing.Down].includes(this.facing);
  }

  public get isHorizontal(): boolean {
    return !this.isVertical;
  }

  public matchesFacing(square: Square): boolean {
    return this.isVertical ? isValidVerticalSquare(square) : isValidHorizontalSquare(square);
  }

  public on(rasterMap: RasterMap): Square | undefined {
    if (rasterMap[this.point[0]] != null) {
      return rasterMap[this.point[0]][this.point[1]];
    }
  }

  public isIn(rasterMap: RasterMap): boolean {
    return this.on(rasterMap) != null;
  }

  /**
   * Gets the next location coordinates (and facing) if advancing one square in the current facing
   * from the current coordinates. Can be considered "stepping forward one square".
   */
  public get next(): Location {
    switch (this.facing) {
      case Facing.Up: return this.up;
      case Facing.Right: return this.right;
      case Facing.Down: return this.down;
      case Facing.Left: return this.left;
    }
  }

  /**
   * Moves forward in the current direction on a raster map until either a condition is satisfied (true),
   * in which case the final location is returned, or we run out of valid squares to walk on, in which
   * case we give up and return undefined (no solution).
   * @param rasterMap Raster map of Squares to walk
   * @param predicate A condition which needs to be satisfied to find a final location to land on
   */
  public walkUntil(rasterMap: RasterMap, predicate: (square: Square) => boolean): Location | undefined {
    const next = this.next;

    if (!next.isIn(rasterMap) || !isSquare(next.on(rasterMap)!)) {
      return;
    }

    if (predicate(next.on(rasterMap)!)) {
      return next;
    }

    return next.walkUntil(rasterMap, predicate);
  }

  /**
   * Determines a facing needed to move towards an adjacent point in a cardinal direction.
   * Throws if point is non-adjacent.
   * @param point Point to compare to
   * @returns Facing needed to move into this square
   */
  public facingTo(point: Point): Facing {
    if (this.point[0] === point[0] && this.point[1] === point[1] - 1) {
      return Facing.Right;
    } else if (this.point[0] === point[0] && this.point[1] === point[1] + 1) {
      return Facing.Left
    } else if (this.point[0] === point[0] + 1 && this.point[1] === point[1]) {
      return Facing.Up;
    } else if (this.point[0] === point[0] - 1 && this.point[1] === point[1]) {
      return Facing.Down;
    } else {
      throw new Error(`Cannot determine facing towards a non-adjacent point`);
    }
  }
}
