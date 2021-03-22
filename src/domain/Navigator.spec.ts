import { expect } from 'chai';
import { Facing, Location } from './Location';

import { hasValidEndpoints, isValidLocation } from './Navigator';
import { parse } from './RasterMap';

describe('Navigator', () => {
  describe('hasValidEndpoints', () => {
    it('should not accept maps without a start square', () => {
      const emptyMap = [[]];
      const noStartMap = parse(`x-A
  |
--+`);
      expect(hasValidEndpoints(emptyMap)).to.eq(false);
      expect(hasValidEndpoints(noStartMap)).to.eq(false);
    });

    it('should not accept maps without an end square', () => {
      const emptyMap = [[]];
      const noEndMap = parse(`@-A
  |
--+`);
      expect(hasValidEndpoints(emptyMap)).to.eq(false);
      expect(hasValidEndpoints(noEndMap)).to.eq(false);
    });

    it('should not accept maps with multiple start squares', () => {
      const twoStartMap = parse(`@-A
  |
@-+`);
      expect(hasValidEndpoints(twoStartMap)).to.eq(false);
    });

    it('should not accept maps with multiple end squares', () => {
      const twoEndMap = parse(`x-A
  |
x-+`);
      expect(hasValidEndpoints(twoEndMap)).to.eq(false);
    });

    it('should accept maps with one start and one end square', () => {
      const firstMap = parse(`@-A
  |
x-+`);
      const secondMap = parse(`--x
  |
A-@`);
      expect(hasValidEndpoints(firstMap)).to.eq(true);
      expect(hasValidEndpoints(secondMap)).to.eq(true);
    });
  });

  describe('isValidLocation', () => {
    const map = parse(`@-+
 -|
x-A`);
    it('should not accept values out of range of the grid', () => {
      expect(isValidLocation(map, new Location([3, 1], Facing.Left), Facing.Left)).to.eq(false);
      expect(isValidLocation(map, new Location([1, 3], Facing.Left), Facing.Left)).to.eq(false);

    });

    it('should not accept an empty space', () => {
      expect(isValidLocation(map, new Location([1, 0], Facing.Left), Facing.Left)).to.eq(false);
    });

    it('should not accept a square that is 90 deg to the current straight path', () => {
      expect(isValidLocation(map, new Location([1, 2], Facing.Down), Facing.Right)).to.eq(false);
      expect(isValidLocation(map, new Location([1, 1], Facing.Left), Facing.Down)).to.eq(false);
    });

    it('should accept a straight path', () => {
      expect(isValidLocation(map, new Location([2, 1], Facing.Down), Facing.Left)).to.eq(true);
      expect(isValidLocation(map, new Location([0, 1], Facing.Right), Facing.Right)).to.eq(true);
    });

    it('should accept a crossroads', () => {
      expect(isValidLocation(map, new Location([2, 2], Facing.Right), Facing.Right)).to.eq(true);
      expect(isValidLocation(map, new Location([0, 2], Facing.Down), Facing.Down)).to.eq(true);
    });
  });
});