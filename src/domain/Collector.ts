import { isSquare, isValidLetter, Square } from './RasterMap';

/**
 * Map traversal collector.
 * It keeps track of two things:
 * 1. Unique visited uppercase letters - in order
 * 2. All visited squares
 *
 * The specifics of what is valid and what is a letter are inherited from the map specification.
 */
export class Collector {
  private _letters: Square[] = [];
  private _path: Square[] = [];

  public get letters(): string {
    return this._letters.join('');
  }

  public get path(): string {
    return this._path.join('');
  }

  public visit(square: Square): this {
    if (!isSquare(square)) {
      throw new Error(`Cannot visit invalid square ${square}`);

    }
    if (isValidLetter(square) && !this._letters.includes(square)) {
      this._letters.push(square);
    }

    this._path.push(square);

    return this;
  }
}