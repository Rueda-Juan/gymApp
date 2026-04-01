export const documentDirectory = '/mock/documents/';

export async function getInfoAsync(_uri: string) {
  return { exists: false, isDirectory: false, size: 0, modificationTime: 0, uri: '' };
}

export async function writeAsStringAsync(_uri: string, _contents: string) {}

export async function readAsStringAsync(_uri: string) {
  return '';
}

export async function deleteAsync(_uri: string) {}

export async function moveAsync(_options: { from: string; to: string }) {}

export const EncodingType = {
  UTF8: 'utf8',
  Base64: 'base64',
} as const;
