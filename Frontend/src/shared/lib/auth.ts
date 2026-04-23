import { getItem, setItem, removeItem } from './storage';

const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function setAccessToken(token: string): Promise<void> {
  await setItem(ACCESS_TOKEN_KEY, token);
}

export async function setRefreshToken(token: string): Promise<void> {
  await setItem(REFRESH_TOKEN_KEY, token);
}

export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    setAccessToken(tokens.accessToken),
    setRefreshToken(tokens.refreshToken),
  ]);
}

export async function clearAuthStorage(): Promise<void> {
  await Promise.all([
    removeItem(ACCESS_TOKEN_KEY),
    removeItem(REFRESH_TOKEN_KEY),
  ]);
}

export async function hasAuthTokens(): Promise<boolean> {
  const token = await getAccessToken();
  return Boolean(token);
}
