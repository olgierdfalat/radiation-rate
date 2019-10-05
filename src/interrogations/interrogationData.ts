import { WorksheetRow } from './../models';
export interface InterrogationData {
  getDeviceId(): string;
  getIdsChecksum(): string;
  getChecksum(): string;
  getWorksheetRow(): WorksheetRow;
}