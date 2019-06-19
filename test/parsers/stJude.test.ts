import {StJudeField} from './../../src/parsers';

describe('StJude parser', () => {
  it('should parse string field by line', () => {
    const line = '100Programmer Marketing NameMerlin';
    const parser = new StJudeField();
    const field = parser.getField(line, 'Programmer Marketing Name');
    
    expect(field.id).toBe(100);    
    expect(field.name).toBe('Programmer Marketing Name');
    expect(field.type).toBe('string');
    expect(field.value).toMatch(/Merlin/);
  });
});