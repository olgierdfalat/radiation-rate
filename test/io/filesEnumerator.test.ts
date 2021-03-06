import { promises as fs } from 'fs';
import rimraf from 'rimraf'
import getAllFiles from './../../src/io/filesEnumerator'

describe('files enumerator', () => {
  const root = '/tmp/radiation-rate';
  afterEach(() => {
    rimraf.sync(root);
  });
  async function createFiles() {
    await fs.mkdir(root);
    await fs.mkdir('/tmp/radiation-rate/Logs');
    await fs.mkdir('/tmp/radiation-rate/Medtronic');
    await fs.mkdir('/tmp/radiation-rate/Unity');
    
    await fs.writeFile('/tmp/radiation-rate/Logs/log1.log', 'Test');
    await fs.writeFile('/tmp/radiation-rate/Logs/temp.txt', 'Test');
    await fs.writeFile('/tmp/radiation-rate/Medtronic/log2.log', 'Test');
    await fs.writeFile('/tmp/radiation-rate/Medtronic/log3.log', 'Test');
    await fs.writeFile('/tmp/radiation-rate/Unity/log4.log', 'Test');
  }
  it('recursively enumerates files', async () => {    
    const now = new Date();
    await createFiles();

    const filesInfo = await getAllFiles(root);
    expect(filesInfo.includedFiles.map(f => f.filePath)).toEqual(['/tmp/radiation-rate/Logs/log1.log', '/tmp/radiation-rate/Logs/temp.txt', 
                           '/tmp/radiation-rate/Medtronic/log2.log', '/tmp/radiation-rate/Medtronic/log3.log',
                          '/tmp/radiation-rate/Unity/log4.log']);
    
    expect(filesInfo.includedFiles.map(f => f.fileName)).toEqual(['log1.log', 'temp.txt', 'log2.log', 'log3.log', 'log4.log']);
    expect(filesInfo.excludedFiles).toEqual([]);
    filesInfo.includedFiles.forEach(f => {
      expect(f.dateModified > now).toBe(true);
    });                         
  });

  it('filters files', async () => {    
    await createFiles();
    const filesInfo = await getAllFiles(root, fileInfo => fileInfo.fileName.endsWith('.txt'));
    expect(filesInfo.includedFiles.map(f => f.fileName)).toEqual(['temp.txt']);
    expect(filesInfo.excludedFiles.map(f => f.fileName)).toEqual(['log1.log', 'log2.log', 'log3.log', 'log4.log']);
  });
});