import * as path from 'path';
import {Interrogation} from './../../src/interrogations';

describe('interrogation base class', () => {
  it('should load content from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/1000000_01.log');  
    const interrogation = new Interrogation(filePath);
    const content = await interrogation.getContent();
    expect(content).toMatchSnapshot();
  });
});