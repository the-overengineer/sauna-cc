// tslint:disable:no-unused-expression
import { expect } from 'chai';

import { isSquare, isValidLetter, parse } from './RasterMap';

describe('RasterMap utility functions', () => {
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

  describe('parse', () => {
    it('should throw if given an empty string', () => {
      expect(() => parse('')).to.throw;
    });

    it('should not accept rows of unequal length', () => {
      const invalidMap = `@--
+
+---`;

      expect(() => parse(invalidMap)).to.throw;
    });

    it('should not accept invalid characters', () => {
      const invalidMap = `@--
   |
x-%`;
      expect(() => parse(invalidMap)).to.throw;
    });

    it('should produce a map representation for valid input squares (without checking valid pathfinding)', () => {
      const invalidMap = `@-+
  |
x-+`;
      expect(parse(invalidMap)).to.be.ok;
    });
  });
});