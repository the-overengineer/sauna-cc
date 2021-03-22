import { isSquare, isValidLetter, Square } from './RasterMap';

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