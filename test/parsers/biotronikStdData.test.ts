import { BiotronikStdData } from '../../src/parsers';
import checksum from '../../src/util/checksum';

describe('BiotronikStd data parser', () => {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
  <carddas:InterfaceData>
    <carddas:Patient>
      <carddas:PersonalData>
        <carddas:FirstName>ANONYMOUS</carddas:FirstName>
        <carddas:LastName>ANONYMOUS</carddas:LastName>
        <carddas:DateOfBirth>1949-07-10</carddas:DateOfBirth>
      </carddas:PersonalData>
    </carddas:Patient>  
  </carddas:InterfaceData>
  `;

  it('should return checksum for all field ids', () => {
    const biotronikStdData = new BiotronikStdData(content, '/filePath');
    const expectedChecksum = checksum('InterfaceData-Patient-PersonalData-FirstName-LastName-DateOfBirth-');
    expect(biotronikStdData.getIdsChecksum()).toBe(expectedChecksum);
  });

  it('should return checksum for content', () => {
    const biotronikStdData = new BiotronikStdData(content, '/filePath');
    expect(biotronikStdData.getChecksum()).toBe('90e74c0aaac061ee99e3fe3c9893cd18faa47c42');
  })
});