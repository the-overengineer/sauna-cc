// tslint:disable:no-unused-expression
import { expect } from 'chai';

import { Facing, Location } from './Location';


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
});