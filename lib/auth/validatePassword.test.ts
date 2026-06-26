import { describe, expect, it } from 'vitest';
import { validateNewPassword } from './validatePassword';

describe('validateNewPassword', () => {
  it('accepts matching passwords with 8+ chars', () => {
    expect(validateNewPassword('senha1234', 'senha1234')).toBeNull();
  });

  it('rejects mismatched passwords', () => {
    expect(validateNewPassword('senha1234', 'outra1234')).toBe('mismatch');
  });

  it('rejects passwords shorter than 8 chars', () => {
    expect(validateNewPassword('curto', 'curto')).toBe('tooShort');
  });

  it('checks length before match (too short and mismatched -> tooShort)', () => {
    expect(validateNewPassword('abc', 'xyz')).toBe('tooShort');
  });

  it('rejects empty input', () => {
    expect(validateNewPassword('', '')).toBe('tooShort');
  });
});
