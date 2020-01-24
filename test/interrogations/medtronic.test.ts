import * as path from 'path';
import * as interrogations from '../../src/interrogations';

describe('interrogation Medtronic class', () => {
  it('should get structured data row from file', async () => {
    const filePath = path.join(__dirname, '../../../radiation-rate-data/test/Medtronic/PYZ626053S_17123650.xls');
    const medtronic = new interrogations.Medtronic(filePath);
    const data = await medtronic.getData();
    expect(data.getRow()).toMatchSnapshot();
  });
});