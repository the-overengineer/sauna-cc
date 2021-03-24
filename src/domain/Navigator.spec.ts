// tslint:disable:no-unused-expression
import { expect } from 'chai';

import { hasValidEndpoints, walk } from './Navigator';
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
