import * as models from './../../../models';

export interface Converter {
  convert(field: models.StJudeFieldModel): models.StJudeFieldModel;
}