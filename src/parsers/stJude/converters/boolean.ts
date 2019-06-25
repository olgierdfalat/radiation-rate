import { Converter } from './converter';
import * as models from './../../../models';

export class Boolean implements Converter {
  convert(field: models.StJudeFieldModel): models.StJudeFieldModel {
    const value: string = (field.value || '').toString().toLowerCase();
    if (value === 'true') {
      field.type = 'boolean';
      field.value = true;
    }
    else if (value === 'false') {
      field.type = 'boolean';
      field.value = false;
    }

    return field;
  }
}
