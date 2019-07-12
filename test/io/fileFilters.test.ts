import {isStJudeLogFile} from './../../src/io/fileFilters';

describe('file filters', () => {
  describe('StJude filter', () => {
    ['1050629.log', '1043425_1.log', '1043425_38.LOG'].forEach(testCase => {
      it(`returns true for ${testCase}` , () => {      
        expect(isStJudeLogFile({fileName: testCase, filePath: '/' + testCase, dateModified: new Date()})).toBe(true);
      });  
    });
  })

  it('returns false', () => {
    expect(isStJudeLogFile({fileName: 'test.txt', filePath: '/test.txt', dateModified: new Date()})).toBe(false);
  });
});