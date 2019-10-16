import { BiotronikStdData } from '../../src/parsers';
import checksum from '../../src/util/checksum';

describe('BiotronikStd data parser', () => {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
  <Paceart>
    <PatientRecords>
      <PatientRecord>
        <Demographics nameLast="ANONYMOUS" nameFirst="ANONYMOUS"/>
      </PatientRecord>  
    </PatientRecords>
  </Paceart>
  `;

  it('should return checksum for all field ids', () => {
    const biotronikStdData = new BiotronikStdData(content, '/filePath');
    const expectedChecksum = checksum('Paceart-PatientRecords-PatientRecord-Demographics-nameLast-nameFirst-');
    expect(biotronikStdData.getIdsChecksum()).toBe(expectedChecksum);
  });

  it('should return checksum for content', () => {
    const biotronikStdData = new BiotronikStdData(content, '/filePath');
    expect(biotronikStdData.getChecksum()).toBe('6ee8ad43c1bf6546ae34b84f07ce7a43a668b24c');
  })
});