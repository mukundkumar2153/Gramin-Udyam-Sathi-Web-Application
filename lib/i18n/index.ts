import { mr } from './mr';
import { hi } from './hi';
import { en } from './en';

export type Language = 'mr' | 'hi' | 'en';

export const translations = {
  mr,
  hi,
  en,
};

export function getTranslation(lang: Language = 'mr') {
  return translations[lang] || translations.mr;
}
