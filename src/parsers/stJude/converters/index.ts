import { Converter } from './converter';
import { Boolean } from './boolean';
import { Numeric } from './numeric';
import { Milliseconds } from './milliseconds';

const converters: Array<Converter> = [
  new Boolean(),
  new Numeric(),
  new Milliseconds()
];

export default converters;
