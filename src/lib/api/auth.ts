import {
  apiRequest,
  getRefreshToken,
  isRecord,
  setAccessToken,
  setRefreshToken,
  unwrapData,
} from './client';

export interface LoginInput {
  email: string;
  password: string;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetInput {
  token: string;
  password: string;
}

export interface BootstrapInput {
  name: string;
  email: string;
  password: string;
}

function rememberAccessToken(response: unknown) {
  const data = unwrapData(response);
  if (!isRecord(data)) return;

  const token =
    typeof data.accessToken === 'string'
      ? data.accessToken
      : typeof data.access_token === 'string'
        ? data.access_token
        : typeof data.token === 'string'
          ? data.token
          : null;

  if (token) setAccessToken(token);

  const nextRefreshToken =
    typeof data.refreshToken === 'string'
      ? data.refreshToken
      : typeof data.refresh_token === 'string'
        ? data.refresh_token
        : null;
  if (nextRefreshToken) setRefreshToken(nextRefreshToken);
}

export async function login(input: LoginInput): Promise<unknown> {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  rememberAccessToken(response);
  return response;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
    setRefreshToken(null);
  }
}

export async function getCurrentUser(): Promise<unknown> {
  return unwrapData(await apiRequest('/auth/me'));
}

export async function refreshSession(): Promise<unknown> {
  const token = getRefreshToken();
  const response = await apiRequest('/auth/refresh', {
    method: 'POST',
    ...(token ? { body: JSON.stringify({ refreshToken: token }) } : {}),
  });
  rememberAccessToken(response);
  return response;
}

export async function changePassword(
  input: PasswordChangeInput,
): Promise<void> {
  await apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  input: PasswordResetInput,
): Promise<void> {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function bootstrap(input: BootstrapInput): Promise<unknown> {
  const response = await apiRequest('/auth/bootstrap', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  rememberAccessToken(response);
  return response;
}
