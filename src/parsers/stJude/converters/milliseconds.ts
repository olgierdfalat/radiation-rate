import { Numeric } from './numeric';
import * as models from '../../../models';

export class Milliseconds extends Numeric {
  convert(field: models.StJudeFieldModel): models.StJudeFieldModel {
    const value: string = (field.firstValue || '').toString().toLowerCase();
    const matcher: RegExp = /\d+\.\d+?ms/;
    if(field.secondValue === 'ms') {
      field.name += '[ms]';
      return super.convert(field);
    }
    if (matcher.test(value)) {
      field.name += '[ms]';
      field.firstValue = value.replace('ms', '');
      return super.convert(field);
    }

    return field;
  }
}