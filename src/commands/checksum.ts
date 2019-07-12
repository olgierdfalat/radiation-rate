import execute from './command';

export function checksum(device: string) {
  execute(device, normalizedDevice => {
    console.log('Generating checksums for', normalizedDevice);
  });
}