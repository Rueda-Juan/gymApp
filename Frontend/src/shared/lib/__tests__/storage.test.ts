jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem, setItem, removeItem, clear, storage } from '../storage';

describe('shared/lib/storage', () => {
  const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports the raw AsyncStorage instance', () => {
    expect(storage).toBe(AsyncStorage);
  });

  it('delegates getItem to AsyncStorage', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue('value');

    const result = await getItem('my-key');

    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith('my-key');
    expect(result).toBe('value');
  });

  it('delegates setItem to AsyncStorage', async () => {
    await setItem('my-key', 'value');

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('my-key', 'value');
  });

  it('delegates removeItem to AsyncStorage', async () => {
    await removeItem('my-key');

    expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('my-key');
  });

  it('delegates clear to AsyncStorage', async () => {
    await clear();

    expect(mockedAsyncStorage.clear).toHaveBeenCalled();
  });
});
