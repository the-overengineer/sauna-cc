import { EOL } from 'os';

/**
 * A square is a single-character string
 */
export type Square = string;

export type RasterMap = Square[][];

const SIMPLE_PATH_SQUARES: Set<Square> = new Set(['-', '|', '+', '@', 'x']);

export const isStartSquare = (square: Square): boolean => square === '@';

export const isEndSquare = (square: Square): boolean => square === 'x';

export const isValidLetter = (square: Square) => /^[A-Z]$/.test(square);

export const isSquare = (candidate: string): candidate is Square =>
  SIMPLE_PATH_SQUARES.has(candidate) || isValidLetter(candidate);

export const parse = (stringRepresentation: string): RasterMap => {
  const map = stringRepresentation.split(EOL).map((row) => row.split(''));

  if (map.length < 1) {
    throw new Error('A map must have at least one row');
  }

  const rowLength = map[0]!.length;
  const everyRowHasEqualLen = map.every((row) => row.length === rowLength);

  if (!everyRowHasEqualLen) {
    throw new Error('Every row must have equal length');
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
