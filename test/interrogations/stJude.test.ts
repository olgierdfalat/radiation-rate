import * as path from 'path';
import * as interrogations from './../../src/interrogations';
import * as errors from './../../src/errors';


describe('interrogation StJude class', () => {
  it('should get structured data row from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/1000000_01.log');
    const stJude = new interrogations.StJude(filePath);
    const data = await stJude.getData();
    expect(data.getRow()).toMatchSnapshot();
  });

  it('should throw No Content exception for empty log file', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/empty-invalid.log');
    const stJude = new interrogations.StJude(filePath);

    await expect(stJude.getData()).rejects.toThrow(errors.NoContent);
  });

});