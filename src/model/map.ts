/**
 * A square is a single-character string
 */
export type Square = string;

export type Map = Square[][];

const SIMPLE_PATH_SQUARES: Set<Square> = new Set(['-', '|', '+', '@', 'x']);

export const isStartSquare = (square: Square): boolean => square === '@';

export const isEndSquare = (square: Square): boolean => square === 'x';

export const isValidLetter = (square: Square) => /^[A-Z]$/.test(square);

export const isSquare = (candidate: string): candidate is Square =>
  SIMPLE_PATH_SQUARES.has(candidate) || isValidLetter(candidate);
