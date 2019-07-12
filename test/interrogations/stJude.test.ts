import * as path from 'path';
import * as interrogations from '../../src/interrogations';


describe('interrogation StJude class', () => {
  it('should get structured data row from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/1000000_01.log');
    const stJude = new interrogations.StJude(filePath);
    const data = await stJude.getData();
    expect(data.getRow()).toMatchSnapshot();
  });
});