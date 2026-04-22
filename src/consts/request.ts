import type { OptionsInit } from 'got';

export const HTTP_HEADERS: Readonly<Record<string, string>> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'ru-RU,ru;q=0.9',
} as const;

export const GOT_OPTIONS: OptionsInit = {
  headers: HTTP_HEADERS,
  timeout: {
    request: 10_000,
  },
  retry: {
    limit: 3,
    backoffLimit: 4_000,
  },
} as const;

export const VACANCY_SELECTORS = [
  '[data-qa="vacancy-title"]',
  '[data-qa="vacancy-description"]',
] as const;
