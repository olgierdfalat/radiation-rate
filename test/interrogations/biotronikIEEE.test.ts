import * as path from 'path';
import * as interrogations from '../../src/interrogations';
import * as errors from '../../src/errors';


describe('interrogation Biotronik IEEE class', () => {
  it('should get structured data row from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/Biotronik/BIOIEEE_60485754_ANONYMOUS_A_2016-12-23_12-12-56.xml');
    const biotronikIEEE = new interrogations.BiotronikIEEE(filePath);
    const data = await biotronikIEEE.getData();
    expect(data.getRow()).toMatchSnapshot();
  });

  it('should get structured data with IMPEDANCE row from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/Biotronik/BIOIEEE_60655694_ANONYMOUS_A_2015-08-20_14-50-27.xml');
    const biotronikIEEE = new interrogations.BiotronikIEEE(filePath);
    const data = await biotronikIEEE.getData();
    expect(data.getRow()).toMatchSnapshot();
  });

  it('should throw No Content exception for empty log file', async () => {
    const filePath = path.join(__dirname, '../fixtures/empty-invalid.log');
    const biotronikIEEE = new interrogations.BiotronikIEEE(filePath);
    await expect(biotronikIEEE.getData()).rejects.toThrow(errors.NoContent);
  });
});