import { RasterMap, Square } from './RasterMap';

type Index = number;

export enum Facing {
  Up = 'Up',
  Right = 'Right',
  Down = 'Down',
  Left = 'Left',
}

/**
 * A point in a raster, as [row, column], 0-indexed
 */
export type Point = [Index, Index];

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

  public on(rasterMap: RasterMap): Square | undefined {
    if (rasterMap[this.point[0]] != null) {
      return rasterMap[this.point[0]][this.point[1]];
    }
  }

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
