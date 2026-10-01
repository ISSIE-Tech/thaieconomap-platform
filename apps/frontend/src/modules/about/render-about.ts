import type { SiteContentStrings } from 'src/modules/site-content/get-site-content';

import { ABOUT_TEMPLATE } from './about-template';

export type AboutLang = 'th' | 'en';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// CMS copy may use <em>, <strong> and <br> (the design relies on them); everything else is escaped.
const richText = (s: string) => escapeHtml(s).replace(/&lt;(\/?)(em|strong|br)\s*\/?&gt;/g, '<$1$2>');

export function renderAbout(strings: SiteContentStrings, lang: AboutLang) {
  return ABOUT_TEMPLATE.replace(/\{\{(?:(attr|pressed):)?([\w.]+)\}\}/g, (_, kind, key: string) => {
    if (kind === 'pressed') return String(key === lang);
    const value = strings[key]?.[lang] || strings[key]?.th || '';

    return kind === 'attr' ? escapeHtml(value) : richText(value);
  });
}
