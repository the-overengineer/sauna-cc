// tslint:disable:no-console
import fs from 'fs';

import { walk } from './domain/Navigator';
import { parse } from './domain/RasterMap';

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Expected one argument - the file to read the map from');
} else {
  try {
    const mapText = fs.readFileSync(args[0]).toString();
    try {
      const map = parse(mapText);
      const resultCollector = walk(map);
      console.log(resultCollector.letters);
      console.log(resultCollector.path);
    } catch {
      console.log('Error');
    }
  } catch (err) {
    console.error(`Could not read a map from the given file ${args[0]}`)
    console.error(err);
  }
}
