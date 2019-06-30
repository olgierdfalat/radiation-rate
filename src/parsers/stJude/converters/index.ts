import { Converter } from './converter';
import { Boolean } from './boolean';
import { Numeric } from './numeric';
import { Milliseconds } from './milliseconds';
import { Joules } from './joules';
import { Percentages } from './percentages';
import { Seconds } from './seconds';
import { Ohm } from './ohm';
import { Bpm } from './bpm';
import { Yrs } from './yrs';
import { Months } from './months';
import { Minutes } from './minutes';
import { Volts } from './volts';
import { Day } from './day';
import { Hours } from './hours';
import { MicroVolts } from './microVolts';
import { SerialNumber } from './serialNumber';
import { DateTime } from './datetime';
import { Time } from './time';

const converters: Array<Converter> = [
  new Boolean(),
  new Numeric(),
  new Milliseconds(),
  new Joules(),
  new Percentages(),
  new Seconds(),
  new Ohm(),
  new Bpm(),
  new Yrs(),
  new Months(),
  new Minutes(),
  new Volts(),
  new Day(),
  new Hours(),
  new MicroVolts(),
  new SerialNumber(),
  new DateTime(),
  new Time()
];

export default converters;
