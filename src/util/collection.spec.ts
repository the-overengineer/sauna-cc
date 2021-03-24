import { expect } from 'chai';
import { count, sum } from './collection';

describe('collection utilities', () => {
  describe('sum', () => {
    it('should return 0 for an empty list', () => {
      expect(sum([])).to.eq(0);
    });

    it('should sum up the numbers in the list', () => {
      expect(sum([1])).to.eq(1);
      expect(sum([1, 2])).to.eq(3);
      expect(sum([1, -2])).to.eq(-1);
      expect(sum([1, 2, 3])).to.eq(6);
      expect(sum([1, 2, -3])).to.eq(0);
      expect(sum([-1, -2, -3])).to.eq(-6);
    });
  });

  describe('count', () => {
    it('should always return 0 for an empty list', () => {
      expect(count([], () => true)).to.eq(0);
      expect(count([], () => false)).to.eq(0);
    });

    it('should return the number of elements that satisfy the condition', () => {
      const isEven = (n: number) => Math.abs(n) % 2 === 0;
      const isOdd = (n: number) => Math.abs(n) % 2 === 1;
      const isX = (it: string) => it === 'X';

      expect(count([1, 2, 3], isEven)).to.eq(1);
      expect(count([1, 2, 3], isOdd)).to.eq(2);
      expect(count([-1, -2, -3], isEven)).to.eq(1);
      expect(count([-1, -2, -3], isOdd)).to.eq(2);

      expect(count(['X', 'X', 'X'], isX)).to.eq(3);
      expect(count(['Y', 'Y', 'Y'], isX)).to.eq(0);
    });
  });
});
