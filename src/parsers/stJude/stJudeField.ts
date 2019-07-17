import * as models from './../../models';
import converters from './converters';

const SEPARATOR = String.fromCharCode(28);

export class StJudeField {
  getField(line: string, type = 'string'): models.FieldModel {
    const fields = line.split(SEPARATOR);

    if (fields.length < 4) {
      return undefined;
    }
    const firstValue: any = fields[2];
    const secondValue: any = fields[3];
    let field: models.FieldModel = {
      id: parseInt(fields[0]),
      name: fields[1],
      type,
      firstValue,
      secondValue
    };

    converters.forEach(converter => {
      field = converter.convert(field);
    });
    return field;
  }
}