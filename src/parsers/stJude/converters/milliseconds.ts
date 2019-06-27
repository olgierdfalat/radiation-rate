import { Numeric } from './numeric';
import * as models from '../../../models';

export class Milliseconds extends Numeric {
  convert(field: models.StJudeFieldModel): models.StJudeFieldModel {
    const value: string = (field.value || '').toString().toLowerCase();
    const matcher: RegExp = /\d+\.\d+?ms/;
    if(matcher.test(value)) {
      field.name += '[ms]';
      field.value = value.replace('ms', '');
      return super.convert(field)
    }

    return field;
  }
}