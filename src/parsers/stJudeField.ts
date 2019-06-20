const SEPARATOR = String.fromCharCode(28);

export class StJudeField {
  getField(line: string, type = 'string') {
    const fields = line.split(SEPARATOR);

    if (fields.length < 3) {
      throw new Error(`Line "${line}", should contain at least three elements.`);
    }
    let value: any = fields[2];
    if (type == 'number') {
      const number = Number(value);
      if (isNaN(number)) {
        throw new Error(`Value: "${value}" inside "${line}" is not a number.`);
      }
      value = number;
    }

    if(type == 'boolean') {
      value = (value || '').toLowerCase() == 'true'
    }
    return {
      id: parseInt(fields[0]),
      name: fields[1],
      type,
      value
    };
  }
}