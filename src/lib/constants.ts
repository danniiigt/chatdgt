export enum LOCALE {
  EN = "en",
  ES = "es",
}

export const LOCALES: LOCALE[] = [LOCALE.ES, LOCALE.EN];
export const DEFAULT_LOCALE: LOCALE = LOCALE.ES;
export const RESEND_COOLDOWN_SECONDS = 90;
export const RESEND_STORAGE_KEY_PREFIX = "email_resend";
