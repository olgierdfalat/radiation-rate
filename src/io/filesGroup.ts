import FileInfo from './fileInfo';

export default interface FilesGroup {
  deviceId: string;
  files: FileInfo[];
}