export interface InterrogationData {
  getDeviceId(): string;
  getIdsChecksum(): string;
  getChecksum(): string;
}