import { Boolean } from './boolean';
import { Numeric } from './numeric';
import { Converter } from './converter';

const converters: Array<Converter> = [
  new Boolean(),
  new Numeric()
];

export default converters;
