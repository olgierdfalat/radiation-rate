import * as models from '../models';
import checksum from '../util/checksum';

export class WorksheetsDataProvider {
  getWorksheetData(deviceId: string, rows: Array<models.WorksheetRow>): models.WorksheetData   {
    const columnsLength = [...new Set([].concat.apply([], rows.map(x => x.map(f => f.name))))].length;
    const data: models.WorksheetData = {name: 'interrogations', deviceId, columns: new Array(columnsLength), rows: []};
    const rowsChecksums: string[] = new Array(rows.length);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const newRow = new Array<models.ValueTypePair>(columnsLength);

      for (let j = 0; j < row.length; j++) {
        const field = row[j];
        const columnIndex = data.columns.indexOf(field.name);
        if (columnIndex != -1) {
          newRow[columnIndex] = {value: field.value, type: field.type};
        }
        else {
          const firstEmptyColumnIndex = data.columns.findIndex(c => !c);
          data.columns[firstEmptyColumnIndex] = field.name;
          newRow[firstEmptyColumnIndex] = {value: field.value, type: field.type};
        }
      }

      const rowChecksum = checksum(newRow.map(i => (i.value || '') + ':' + (i.type || '')).join('|'));
      if (!rowsChecksums.includes(rowChecksum)) {
        data.rows.push(newRow);
      }
      rowsChecksums[i] = rowChecksum;
    }
    return data;
  }
}