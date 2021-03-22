// tslint:disable:no-unused-expression
import { expect } from 'chai';

import { Collector } from './Collector';


describe('Collector', () => {
  it('should throw if given invalid symbols', () => {
    const collector = new Collector();

    expect(() => collector.visit('9')).to.throw;
    expect(() => collector.visit('#')).to.throw;
    expect(() => collector.visit(' ')).to.throw;
  });

  it('should collect letters only once, and ignore non-letters', () => {
    const collector = new Collector();

    const letters = collector.visit('A').visit('-').visit('B').visit('+').visit('A').visit('C').visit('|').visit('B').letters;

    expect(letters).to.eq('ABC');
  });

  it('should collect every valid path symbol visited', () => {
    const collector = new Collector();

    const path = collector.visit('A').visit('-').visit('B').visit('+').visit('A').visit('C').visit('|').visit('B').path;

    expect(path).to.eq('A-B+AC|B');
  });
});
