import { Converter } from './converter';
import * as models from './../../../models';

export class SerialNumber implements Converter {
  convert(field: models.FieldModel): models.FieldModel {
    const value: string = (field.firstValue || '').toString();
    if (field.name === 'Programmer Serial Number' || field.name === 'RV Lead Serial Number') {
      field.firstValue = value;
    }
    return field;
  }
}
