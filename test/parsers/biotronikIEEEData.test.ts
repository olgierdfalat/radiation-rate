import { BiotronikIEEEData } from '../../src/parsers';
import checksum from '../../src/util/checksum';

describe('BiotronikIEEE data parser', () => {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
  <biotronik-ieee11073-export>
    <dataset>
      <section name="MDC">
        <section name="IDC">
          <section name="DEV">
            <value name="TYPE" type="MDC_IDC_ENUM_DEV_TYPE">ICD</value>
          </section>
        </section>
      </section>
    </dataset>
  </biotronik-ieee11073-export>
  `;

  it('should return checksum for all field ids', () => {
    const biotronikIEEEData = new BiotronikIEEEData(content, '/filePath');
    const expectedChecksum = checksum('biotronik-ieee11073-export-dataset-section-name-section-name-section-name-value-name-type-');
    expect(biotronikIEEEData.getIdsChecksum()).toBe(expectedChecksum);
  });

  it('should return checksum for content', () => {
    const biotronikIEEEData = new BiotronikIEEEData(content, '/filePath');
    expect(biotronikIEEEData.getChecksum()).toBe('4d4a5530aced9a5b862585d5154e532a1cf86120');
  })
});