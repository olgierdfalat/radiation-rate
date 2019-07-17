import { Converter } from './converter';
import * as models from '../../../models';
const parse = require('date-fns/parse');

/*
var result = parse(
  '02/11/2014',
  'MM/dd/yyyy',
  new Date()
)
*/

export class DateTime implements Converter {
  convert(field: models.FieldModel): models.FieldModel {
    const value: string = (field.firstValue || '').toString().toLowerCase();
    const dateFields = ['Last Max Charge Date', 'Implant Date: Device', 'Device Last Interrogation Date and Time',
                        'Right Ventricular Pacing Lead Impedance Notification Time Stamp (Date)'];
    if (dateFields.indexOf(field.name) != -1) {
      const dateValue = parse(value, 'dd/MM/yyy');
        field.type = 'datetime';
        field.firstValue = dateValue;
    }
    return field;
  }
}
