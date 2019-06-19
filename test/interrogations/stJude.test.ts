import * as path from 'path';
import {StJude} from '../../src/interrogations';

describe('interrogation JtJude class', () => {
  it('should get structured data from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/1000000_01.log');  
    const stJude = new StJude(filePath);
    const data = await stJude.getData();
    expect(data).toMatchSnapshot();
  });
});