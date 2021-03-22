type Index = number;

export enum Facing {
  Up,
  Right,
  Down,
  Left,
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
      Facing.Up,
    );
  }

  public get down(): Location {
    return new Location(
      [this.point[0] + 1, this.point[1]],
      Facing.Up,
    );
  }

  public get left(): Location {
    return new Location(
      [this.point[0], this.point[1] - 1],
      Facing.Up,
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
}
