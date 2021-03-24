import { EOL } from 'os';

/**
 * A square is a single-character string
 */
export type Square = string;

/**
 * A representation of a raster map of characters.
 */
export type RasterMap = Square[][];

export const VERTICAL_SQUARE = '|';
export const HORIZONTAL_SQUARE = '-';
export const CROSSROADS_SQUARE = '+';
export const START_SQUARE = '@';
export const END_SQUARE = 'x';

const SIMPLE_PATH_SQUARES: Set<Square> = new Set([
  VERTICAL_SQUARE,
  HORIZONTAL_SQUARE,
  CROSSROADS_SQUARE,
  START_SQUARE,
  END_SQUARE,
]);

export const isStartSquare = (square: Square): boolean => square === START_SQUARE;

export const isEndSquare = (square: Square): boolean => square === END_SQUARE;

export const isValidLetter = (square: Square) => /^[A-Z]$/.test(square);

export const isValidVerticalSquare = (square: Square): boolean =>
  [VERTICAL_SQUARE, CROSSROADS_SQUARE].includes(square) || isValidLetter(square) || isEndSquare(square);

export const isValidHorizontalSquare = (square: Square): boolean =>
  [HORIZONTAL_SQUARE, CROSSROADS_SQUARE].includes(square) || isValidLetter(square) || isEndSquare(square);

export const isCrossroads = (square: Square): boolean =>
  CROSSROADS_SQUARE === square || isStartSquare(square) || isEndSquare(square);

export const isSquare = (candidate: string): candidate is Square =>
  SIMPLE_PATH_SQUARES.has(candidate) || isValidLetter(candidate);

export const parse = (stringRepresentation: string): RasterMap => {
  const map = stringRepresentation.split(EOL).map((row) => row.split(''));

  if (map.length < 1) {
    throw new Error('A map must have at least one row');
  }

  map.forEach((row, i) => {
    row.forEach((square, j) => {
      // Maps may only contain valid squares and empty squares
      if (!isSquare(square) && square !== ' ') {
        throw new Error(`Invalid square ${square} at position (${i}, ${j})`);
      }
    })
  })

  return map;
}
