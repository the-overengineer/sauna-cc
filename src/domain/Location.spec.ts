// tslint:disable:no-unused-expression
import { expect } from 'chai';

import { Facing, Location } from './Location';
import { parse } from './RasterMap';


describe('Location', () => {
  describe('facingTo', () => {
    const location = new Location([1, 1], Facing.Left);

    it('should get the correct facing for all 4 basic directions', () => {

      expect(location.facingTo([0, 1])).to.eq(Facing.Up);
      expect(location.facingTo([2, 1])).to.eq(Facing.Down);
      expect(location.facingTo([1, 0])).to.eq(Facing.Left);
      expect(location.facingTo([1, 2])).to.eq(Facing.Right);
    });

    it('should throw otherwise', () => {
      expect(() => location.facingTo([1, 1])).to.throw;
      expect(() => location.facingTo([2, 2])).to.throw;
      expect(() => location.facingTo([0, 0])).to.throw;
    });
  });

  describe('isIn', () => {
    const map = parse(` @+
  |-
 x+|`);
    it('should return true for any square inside the raster, even an empty one', () => {
      for (const i of [0, 1, 2]) {
        for (const j of [0, 1, 2]) {
          expect(new Location([i, j], Facing.Right).isIn(map)).to.eq(true);
        }

        expect(new Location([1, 3], Facing.Right).isIn(map)).to.eq(true);
        expect(new Location([2, 3], Facing.Right).isIn(map)).to.eq(true);
      }

    });

    it('should return false if the square is not a defined square in the raster', () => {
      expect(new Location([-1, 1], Facing.Right).isIn(map)).to.eq(false);
      expect(new Location([5, 5], Facing.Right).isIn(map)).to.eq(false);
      expect(new Location([0, 3], Facing.Right).isIn(map)).to.eq(false);
    });
  });

  describe('next', () => {
    it('should get the next location in the current facing, even if it is not a valid matrix location', () => {
      expect(new Location([0, 0], Facing.Right).next.point).to.deep.eq([0, 1]);
      expect(new Location([0, 0], Facing.Right).next.facing).to.eq(Facing.Right);
      expect(new Location([0, 0], Facing.Left).next.point).to.deep.eq([0, -1]);
      expect(new Location([0, 0], Facing.Left).next.facing).to.eq(Facing.Left);
      expect(new Location([0, 0], Facing.Up).next.point).to.deep.eq([-1, 0]);
      expect(new Location([0, 0], Facing.Up).next.facing).to.eq(Facing.Up);
      expect(new Location([0, 0], Facing.Down).next.point).to.deep.eq([1, 0]);
      expect(new Location([0, 0], Facing.Down).next.facing).to.eq(Facing.Down);
    });
  });

  describe('walkUntil', () => {
    const map = parse(` @+
  |-
 x+|`);

    it('should return the first next square that satisfies the given condition', () => {
      const start = new Location([0, 1], Facing.Right);
      expect(start.walkUntil(map, () => true)).to.be.ok;
      expect(start.walkUntil(map, () => true)?.point).to.deep.eq([0, 2]);
      expect(start.walkUntil(map, (it) => it === '+')).to.be.ok;
      expect(start.walkUntil(map, (it) => it === '+')?.point).to.deep.eq([0, 2]);

    });

    it('should work even if the starting square is invalid - not its job to care', () => {
      const start = new Location([0, 0], Facing.Right);
      expect(start.walkUntil(map, () => true)).to.be.ok;
      expect(start.walkUntil(map, () => true)?.point).to.deep.eq([0, 1]);
      expect(start.walkUntil(map, (it) => it === '+')).to.be.ok;
      expect(start.walkUntil(map, (it) => it === '+')?.point).to.deep.eq([0, 2]);
    });

    it('should return false if it walks into an empty square', () => {
      const start = new Location([1, 0], Facing.Right);
      expect(start.walkUntil(map, () => true)).to.be.undefined;
    });

    it('should return false if it walks out of the map', () => {
      const start = new Location([0, 0], Facing.Right);
      expect(start.walkUntil(map, () => false)).to.be.undefined;
    });
  });
});