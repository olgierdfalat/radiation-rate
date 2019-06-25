import * as models from './../../models';
import converters from './converters';

const SEPARATOR = String.fromCharCode(28);

export class StJudeField {
  getField(line: string, type = 'string'): models.StJudeFieldModel {
    const fields = line.split(SEPARATOR);

    if (fields.length < 3) {
      return undefined;
    }
    let value: any = fields[2];
    let field = {
      id: parseInt(fields[0]),
      name: fields[1],
      type,
      value
    };

    converters.forEach(converter => {
      field = converter.convert(field);
    });
    return field;
  }
}