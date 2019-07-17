import { Converter } from './converter';
import * as models from '../../../models';

export class Numeric implements Converter {
  convert(field: models.FieldModel): models.FieldModel {
    const value: string = (field.firstValue || '').toString().toLowerCase();
    if (value.length > 0) {
      const number = Number(value);
      if (!isNaN(number)) {
        field.type = 'numeric';
        field.firstValue = number;
      }
    }

    return field;
  }
}
