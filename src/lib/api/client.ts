let accessToken: string | null = null;
let refreshToken: string | null = null;

function getApiRoot() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

  if (!configuredUrl) {
    throw new Error(
      'API URL is missing. Configure NEXT_PUBLIC_API_URL in .env.local.',
    );
  }

  return /\/api\/v1$/i.test(configuredUrl)
    ? configuredUrl
    : `${configuredUrl}/api/v1`;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
}

export function getRefreshToken() {
  return refreshToken;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function unwrapData(value: unknown): unknown {
  return isRecord(value) && 'data' in value ? value.data : value;
}

export async function apiRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${getApiRoot()}${path}`, {
    ...init,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });
  const text = await response.text();
  let result: unknown;

  if (text) {
    try {
      result = JSON.parse(text) as unknown;
    } catch {
      result = text;
    }
  }

  if (!response.ok) {
    const message =
      isRecord(result) && typeof result.message === 'string'
        ? ` ${result.message}`
        : typeof result === 'string' && result
          ? ` ${result}`
          : '';
    throw new Error(`API request failed (${response.status}).${message}`);
  }

  return result as T;
}
