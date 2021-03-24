// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { Facing, Location } from './Location';

import { hasValidEndpoints, isValidLocation, walk } from './Navigator';
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
      expect(isValidLocation(map, new Location([3, 1], Facing.Left), new Location([3, 2], Facing.Left))).to.eq(false);
      expect(isValidLocation(map, new Location([1, 3], Facing.Left), new Location([2, 3], Facing.Left))).to.eq(false);

    });

    it('should not accept an empty space', () => {
      expect(isValidLocation(map, new Location([1, 0], Facing.Left), new Location([3, 2], Facing.Left))).to.eq(false);
    });

    it('should not accept a square that is 90 deg to the current straight path', () => {
      expect(isValidLocation(map, new Location([1, 2], Facing.Down), new Location([0, 1], Facing.Right))).to.eq(false);
      expect(isValidLocation(map, new Location([1, 1], Facing.Left), new Location([0, 0], Facing.Down))).to.eq(false);
    });

    it('should accept a straight path', () => {
      expect(isValidLocation(map, new Location([2, 1], Facing.Down), new Location([2, 2], Facing.Down))).to.eq(true);
      expect(isValidLocation(map, new Location([0, 1], Facing.Right), new Location([0, 0], Facing.Right))).to.eq(true);
    });

    it('should accept a crossroads', () => {
      expect(isValidLocation(map, new Location([2, 2], Facing.Right), new Location([1, 2], Facing.Right))).to.eq(true);
      expect(isValidLocation(map, new Location([0, 2], Facing.Down), new Location([0, 1], Facing.Right))).to.eq(true);
    });
  });

  describe('walking examples', () => {
    it('should work for a basic example', () => {
      const map = parse(`  @---A---+
          |
  x-B-+   C
      |   |
      +---+`);


      expect(walk(map).letters).to.eq('ACB');
      expect(walk(map).path).to.eq('@---A---+|C|+---+|+-B-x');
    });

    it('should work for straight intersection passes', () => {
      const map = parse(`  @
  | +-C--+
  A |    |
  +---B--+
    |      x
    |      |
    +---D--+`);


    expect(walk(map).letters).to.eq('ABCD')
    expect(walk(map).path).to.eq('@|A+---B--+|+--C-+|-||+---D--+|x');
    });

    it('should work for corner letters', () => {
      const map = parse(`  @---A---+
          |
  x-B-+   |
      |   |
      +---C`);


      expect(walk(map).letters).to.eq('ACB');
      expect(walk(map).path).to.eq('@---A---+|||C---+|+-B-x');
    });


    it('should not collect letters twice', () => {
      const map = parse(`    +--B--+
    |   +-C-+
 @--A-+ | | |
    | | +-+ D
    +-+     |
            x`);


      expect(walk(map).letters).to.eq('ABCD');
      expect(walk(map).path).to.eq('@--A-+|+-+|A|+--B--+C|+-+|+-C-+|D|x');
    });

    it('should maintain direction in compact space', () => {
          const map = parse(` +-B-+
 |  +C-+
@A+ ++ D
 ++    x`);


      expect(walk(map).letters).to.eq('ABCD');
      expect(walk(map).path).to.eq('@A+++A|+-B-+C+++C-+Dx');
    });

    it('should refuse maps with no start', () => {
          const map = parse(`     -A---+
          |
  x-B-+   C
      |   |
      +---+`);


      expect(() => walk(map).letters).to.throw;
    });

    it('should refuse maps with no end', () => {
          const map = parse(`   @--A---+
          |
    B-+   C
      |   |
      +---+`);


      expect(() => walk(map).letters).to.throw;
    });

    it('should refuse maps with multiple starts', () => {
          const map = parse(`   @--A-@-+
          |
  x-B-+   C
      |   |
      +---+`);


      expect(() => walk(map).letters).to.throw;
    });

    it('should refuse maps with multiple ends', () => {
          const map = parse(`   @--A---+
          |
  x-Bx+   C
      |   |
      +---+`);


      expect(() => walk(map).letters).to.throw;
    });

    it('should refuse maps with ambiguous turns', () => {
          const map = parse(`        x-B
          |
   @--A---+
          |
     x+   C
      |   |
      +---+`);


      expect(() => walk(map).letters).to.throw;
    });
  });
});
