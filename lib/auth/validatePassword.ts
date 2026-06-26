export const MIN_PASSWORD_LENGTH = 8;

/** Erro de validação, ou null se a nova senha for válida. */
export type PasswordError = 'tooShort' | 'mismatch';

/**
 * Valida uma nova senha e a sua confirmação. Devolve a chave do erro
 * (para i18n) ou null se for válida. Verifica o comprimento antes da
 * coincidência, para dar a mensagem mais acionável primeiro.
 */
export function validateNewPassword(
    password: string,
    confirm: string,
): PasswordError | null {
    if (password.length < MIN_PASSWORD_LENGTH) return 'tooShort';
    if (password !== confirm) return 'mismatch';
    return null;
}
