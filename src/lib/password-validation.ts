export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_UTF8_BYTES = 72;

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return 'Password must be at least 12 characters.';
  }

  if (new TextEncoder().encode(password).byteLength > PASSWORD_MAX_UTF8_BYTES) {
    return 'Password must not exceed 72 UTF-8 bytes.';
  }

  return null;
}
