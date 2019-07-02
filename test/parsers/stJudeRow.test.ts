import { StJudeRow } from './../../src/parsers';
import checksum from './../../src/util/checksum';

describe('StJude row parser', () => {
  const content = `100Programmer Marketing NameMerlin
  2469RV Lead Serial Number
  390Shortest PVARP/VREF215ms
  `;

  it('should return checksum for all field ids', () => {
    const row = new StJudeRow(content);
    const expectedChecksum = checksum('100-390-2469'); //ids are sorted          
    expect(row.getIdsChecksum()).toBe(expectedChecksum);
  });

  it('should return checksum for content', () => {
    const row = new StJudeRow(content);
    expect(row.getChecksum()).toBe('fa6afd4756c4d0f20e9dcc8b675e06a9a44bd4b6');
  })
});