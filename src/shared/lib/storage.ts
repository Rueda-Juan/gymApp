import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = AsyncStorage;

export async function getItem(key: string): Promise<string | null> {
  return storage.getItem(key);
}

export async function setItem(key: string, value: string): Promise<void> {
  await storage.setItem(key, value);
}

export async function removeItem(key: string): Promise<void> {
  await storage.removeItem(key);
}

export async function clear(): Promise<void> {
  await storage.clear();
}
