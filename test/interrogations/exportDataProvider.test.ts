import {ExportDataProvider} from './../../src/exporters/exportDataProvider';
import * as models from '../../src/models';

describe('Interrogations data provider class', () => {
  it('gets export data - removes duplicates and distributes values into correct columns', () => {
    const exportDataProvider = new ExportDataProvider();
    const inputData = [
                        ['column1:value1','column2:value2', 'column3:value3'],
                        ['column3:value3','column2:value2', 'column1:value1'],
                        ['column2:value2','column3:value3', 'column1:value1'],
                        ['column4:value4','column5:value5'],
                        ['column6:value6'],
                        ['column3:value3','column2:value2', 'column1:value1', 'column7:value7'],
                        ['column1:aaa','column2:bbb', 'column5:ccc', 'column7:ddd']
                      ]
    const rows: models.StJudeRowModel[] = inputData.map(item => {
        const fields: models.KeyValuePair[] = item.map(field => {
          const [key, value] = field.split(':');  
          return {key, value};
        })
        const row:models.StJudeRowModel = fields.map((field, index) => {
          return {name: field.key, id: index, type: 'string', firstValue: field.value, secondValue: null};
        })
        
        return row;
    });
    
    expect(exportDataProvider.getWorksheetData('1234', rows)).toMatchSnapshot();
  });
})