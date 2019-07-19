import { DeviceDataProvider } from './deviceDataProvider';
export interface InterrogationsFactoryInterface {
 getDataProvider(device: string): DeviceDataProvider;
}