import { Numeric } from './numeric';
import * as models from '../../../models';

export class NumericUnit extends Numeric {
  private unitName: string;
  constructor(unitName: string) {
    super();
    this.unitName = unitName;
  }
  convert(field: models.FieldModel): models.FieldModel {
    if (field.secondValue === this.unitName) {
      field.name += `[${this.unitName}]`;
      return super.convert(field);
    }

    return field;
  }
}