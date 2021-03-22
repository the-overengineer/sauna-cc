import { expect } from 'chai';

import { isSquare, isValidLetter } from './map';

describe('Map utility functions', () => {
  describe('isValidLetter', () => {
    it('should accept uppercase English letters', () => {
      ['A', 'C', 'Y', 'R', 'U'].forEach((letter) => {
        expect(isValidLetter(letter)).to.eq(true);
      });
    });

    it('should not accept lowercase English letters', () => {
      ['a', 'c', 'y', 'r', 'u'].forEach((letter) => {
        expect(isValidLetter(letter)).to.eq(false);
      });
    });

    it('should not accept various other symbols', () => {
      ['@', '$', 'ž', '+', '-', '|', '_', ' '].forEach((letter) => {
        expect(isValidLetter(letter)).to.eq(false);
      });
    });
  });

  describe('isSquare', () => {
    it('should accept valid letters', () => {
      ['A', 'C', 'Y', 'R', 'U'].forEach((letter) => {
        expect(isSquare(letter)).to.eq(true);
      });
    });

    it('should accept valid start and end markers', () => {
      ['@', 'x'].forEach((letter) => {
        expect(isSquare(letter)).to.eq(true);
      });
    });

    it('should accept path markers', () => {
      ['-', '|', '+'].forEach((letter) => {
        expect(isSquare(letter)).to.eq(true);
      });
    });

    it('should not accept other symbols', () => {
      ['$', 'ž', '_', ' '].forEach((letter) => {
        expect(isSquare(letter)).to.eq(false);
      });
    });
  });
});