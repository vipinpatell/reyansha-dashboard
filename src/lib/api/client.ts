export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

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

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function unwrapData(value: unknown): unknown {
  return isRecord(value) && 'data' in value ? value.data : value;
}

function getResponseMessage(result: unknown): string {
  if (!isRecord(result)) return '';

  if (typeof result.message === 'string') return result.message;
  if (
    Array.isArray(result.message) &&
    result.message.every((item) => typeof item === 'string')
  ) {
    return result.message.join(' ');
  }

  return '';
}

export function getApiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : 'An unexpected error occurred.';
  }

  if (error.status === 401) return 'Your session has expired. Please sign in again.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  if (error.status === 404) return 'The requested record was not found.';
  if (error.status === 400) return error.message || 'Check the submitted information and try again.';
  if (error.status === 0) return 'Unable to reach the API. Check your network connection.';
  if (error.status >= 500) return 'The API encountered an error. Please try again later.';

  return error.message || `API request failed (${error.status}).`;
}

function isPublicAuthRequest(path: string) {
  return [
    '/auth/login',
    '/auth/logout',
    '/auth/forgot-password',
    '/auth/reset-password',
  ].includes(path);
}

function isPasswordRequest(path: string) {
  return (
    path === '/auth/change-password' ||
    path === '/auth/reset-password' ||
    /^\/users\/[^/]+\/password$/.test(path)
  );
}

function isCredentialRequest(path: string) {
  return path === '/auth/login' || isPasswordRequest(path);
}

export async function apiRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${getApiRoot()}${path}`;
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
      credentials: 'include',
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(0, 'Unable to reach the API.');
  }

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
    const serverMessage = getResponseMessage(result);
    const safeCredentialMessage = isCredentialRequest(path)
      ? path === '/auth/login'
        ? 'Sign-in request is invalid.'
        : response.status === 400
          ? path === '/auth/reset-password'
            ? 'The reset link may be invalid or expired, or the new password may not meet the requirements.'
            : 'Password request is invalid. Use at least 12 characters and no more than 72 UTF-8 bytes.'
          : `Password request failed (${response.status}).`
      : '';
    const message =
      response.status === 401 && path === '/auth/login'
        ? 'Invalid email or password.'
        : safeCredentialMessage ||
          serverMessage ||
          (typeof result === 'string' ? result : `API request failed (${response.status}).`);

    if (
      response.status === 401 &&
      !isPublicAuthRequest(path) &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(new Event('reyansha:unauthorized'));
    }

    throw new ApiError(response.status, message);
  }

  return result as T;
}
