import { Converter } from './converter';
import * as models from './../../../models';

export class Time implements Converter {
  convert(field: models.FieldModel): models.FieldModel {
    if (field.name === 'Right Ventricular Pacing Lead Impedance Notification Time Stamp (Time)') {
      field.type = 'time';
    }
    return field;
  }
}
