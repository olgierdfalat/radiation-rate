import * as path from 'path';
import * as interrogations from '../../src/interrogations';
import * as errors from '../../src/errors';


describe('interrogation Biotronik STD class', () => {
  it('should get structured data row from file', async () => {
    const filePath = path.join(__dirname, '../../../radiation-rate-data/test/Biotronik/BIOSTD_2016-12-23_12-12-56_ANONYMOUS_A_60485754.xml');
    const biotronikStd = new interrogations.BiotronikStd(filePath);
    const data = await biotronikStd.getData();
    expect(data.getRow()).toMatchSnapshot();
  });

  it('should throw No Content exception for empty log file', async () => {
    const filePath = path.join(__dirname, '../fixtures/empty-invalid.log');
    const biotronikStd = new interrogations.BiotronikStd(filePath);
    await expect(biotronikStd.getData()).rejects.toThrow(errors.NoContent);
  });
});