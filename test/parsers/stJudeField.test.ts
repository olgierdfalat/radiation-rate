import { StJudeField } from '../../src/parsers';

describe('StJude field parser', () => {
  const parser = new StJudeField();

  it('should parse string field by line', () => {
    const line = '100Programmer Marketing NameMerlin';
    const field = parser.getField(line);

    expect(field).toEqual({
      id: 100,
      name: 'Programmer Marketing Name',
      type: 'string',
      value: 'Merlin'
    });
  });

  it('should parse field by line with no value', () => {
    const line = '2469RV Lead Serial Number';
    const field = parser.getField(line);

    expect(field).toEqual({
      id: 2469,
      name: 'RV Lead Serial Number',
      type: 'string',
      value: ''
    });
  });

  it('should return undefined when line doesn\'t contain at least three elements', () => {
    const line = 'wrong line';
    expect(parser.getField(line)).toBe(undefined);
  });

  it('should parse number field by line', () => {
    const line = '2393VF Therapy No. Stimuli8';
    const field = parser.getField(line, 'number');

    expect(field).toEqual({
      id: 2393,
      name: 'VF Therapy No. Stimuli',
      type: 'number',
      value: 8
    });
  });

  it('should throw exception when numeric field value is not a number', () => {
    const line = '2393VF Therapy No. StimuliNotNumber';
    expect(() => {
      parser.getField(line, 'number');
    }).toThrowError('Value: "NotNumber" inside "2393VF Therapy No. StimuliNotNumber" is not a number.');
  });
});
