import * as path from 'path';
import * as interrogations from '../../src/interrogations';
import * as errors from '../../src/errors';


describe('interrogation Biotronik class', () => {
  it('should get structured data row from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/Biotronik/BIO_2016-12-23_12-12-56_ANONYMOUS_A_60485754.xml');
    const biotronik = new interrogations.Biotronik(filePath);
    const data = await biotronik.getData();
    expect(data.getRow()).toMatchSnapshot();
  });

  it('should throw No Content exception for empty log file', async () => {
    const filePath = path.join(__dirname, '../fixtures/empty-invalid.log');
    const biotronik = new interrogations.Biotronik(filePath);
    await expect(biotronik.getData()).rejects.toThrow(errors.NoContent);
  });
});