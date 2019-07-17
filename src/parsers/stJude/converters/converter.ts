import * as models from './../../../models';

export interface Converter {
  convert(field: models.FieldModel): models.FieldModel;
}