import { Converter } from './converter';
import * as models from './../../../models';

export class Boolean implements Converter {
  convert(field: models.StJudeFieldModel): models.StJudeFieldModel {
    const value: string = (field.firstValue || '').toString().toLowerCase();
    if (value === 'true') {
      field.type = 'boolean';
      field.firstValue = true;
    }
    else if (value === 'false') {
      field.type = 'boolean';
      field.firstValue = false;
    }

    return field;
  }
}
