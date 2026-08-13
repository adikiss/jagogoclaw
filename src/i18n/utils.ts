import { ui, defaultLocale, type Locale, type TranslationKey } from './ui';

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in ui) {
    return lang as Locale;
  }
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    const dict = ui[locale] ?? ui[defaultLocale];
    return dict[key] ?? ui[defaultLocale][key] ?? key;
  };
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (locale === defaultLocale) {
    return clean === '' ? '/' : `/${clean}/`;
  }
  return clean === '' ? `/${locale}/` : `/${locale}/${clean}/`;
}

export function getAlternatePath(url: URL, targetLocale: Locale): string {
  const [, , ...rest] = url.pathname.split('/');
  const restPath = rest.filter(Boolean).join('/');
  return getLocalizedPath(restPath, targetLocale);
}
