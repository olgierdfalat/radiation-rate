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
      firstValue: 'Merlin',
      secondValue: ''
    });
  });

  it('should parse field by line with no value', () => {
    const line = '2469RV Lead Serial Number';
    const field = parser.getField(line);

    expect(field).toEqual({
      id: 2469,
      name: 'RV Lead Serial Number',
      type: 'string',
      firstValue: '',
      secondValue: ''
    });
  });

  it('should return undefined when line doesn\'t contain at least four elements', () => {
    const SEPARATOR = String.fromCharCode(28);
    const line =  'field1' + SEPARATOR + 'field2' + SEPARATOR + 'field3';
    expect(parser.getField(line)).toBe(undefined);
  });
});
