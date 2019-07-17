import execute from './command';

export async function exportToExcel(device: string) {
  return execute(device, async () => {
    console.log('Exporting to Excel - wip.');
  });
}