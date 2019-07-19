import * as path from 'path';
import * as interrogations from './../../src/interrogations';

describe('interrogation base class', () => {
  it('should load content from file', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/1000000_01.log');
    const interrogation = new interrogations.Interrogation(filePath);
    const content = await interrogation.getContent();
    expect(content).toMatchSnapshot();
    expect(content)
  });

  it('should throw not supported exception while calling getData method', async () => {
    const filePath = path.join(__dirname, '../fixtures/StJude/1000000_01.log');
    const interrogation = new interrogations.Interrogation(filePath);
    await expect(interrogation.getData()).rejects.toThrow(/Not supported/);
  });
});