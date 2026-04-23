import * as storage from '../storage';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setAuthTokens,
  clearAuthStorage,
  hasAuthTokens,
} from '../auth';

jest.mock('../storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('shared/lib/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns access token from storage', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue('access-token');

    const result = await getAccessToken();

    expect(storage.getItem).toHaveBeenCalledWith('auth.accessToken');
    expect(result).toBe('access-token');
  });

  it('returns refresh token from storage', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue('refresh-token');

    const result = await getRefreshToken();

    expect(storage.getItem).toHaveBeenCalledWith('auth.refreshToken');
    expect(result).toBe('refresh-token');
  });

  it('sets both access and refresh tokens', async () => {
    await setAuthTokens({ accessToken: 'a', refreshToken: 'r' });

    expect(storage.setItem).toHaveBeenCalledWith('auth.accessToken', 'a');
    expect(storage.setItem).toHaveBeenCalledWith('auth.refreshToken', 'r');
  });

  it('clears auth storage on logout', async () => {
    await clearAuthStorage();

    expect(storage.removeItem).toHaveBeenCalledWith('auth.accessToken');
    expect(storage.removeItem).toHaveBeenCalledWith('auth.refreshToken');
  });

  it('reports auth presence when access token exists', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue('token');

    const result = await hasAuthTokens();

    expect(result).toBe(true);
  });

  it('reports no auth when access token is absent', async () => {
    (storage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await hasAuthTokens();

    expect(result).toBe(false);
  });
});
