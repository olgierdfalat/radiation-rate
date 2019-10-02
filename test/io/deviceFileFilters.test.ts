import DeviceFileFilters from '../../src/io/deviceFileFilters';

describe('Device file filters', () => {
  describe('StJude filter', () => {
    ['1050629.log', '1043425_1.log', '1043425_38.LOG'].forEach(testCase => {
      it(`returns true for ${testCase}` , () => {      
        expect(DeviceFileFilters['stjude']({fileName: testCase, filePath: '/' + testCase, dateModified: new Date()})).toBe(true);
      });  
    });
  })

  it('returns false', () => {
    expect(DeviceFileFilters['stjude']({fileName: 'test.txt', filePath: '/test.txt', dateModified: new Date()})).toBe(false);
  });
});