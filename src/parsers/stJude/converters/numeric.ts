import { Converter } from './converter';
import * as models from '../../../models';

export class Numeric implements Converter {
  convert(field: models.StJudeFieldModel): models.StJudeFieldModel {
    const value: string = (field.value || '').toString().toLowerCase();
    if (value.length > 0) {
      const number = Number(value);
      if (!isNaN(number)) {
        field.type = 'numeric';
        field.value = number;
      }
    }

    return field;
  }
}
