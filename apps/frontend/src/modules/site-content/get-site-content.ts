import { serverApiUrl } from 'src/config-global';

// Page copy managed in the admin CMS. Each value is a { th, en } pair; the backend
// merges saved values over its built-in defaults, so every known key is present.
export type SiteContentKey = 'about' | 'terms' | 'privacy';
export type SiteContentStrings = Record<string, { th: string; en: string }>;

export async function getSiteContent(key: SiteContentKey): Promise<SiteContentStrings> {
  const res = await fetch(serverApiUrl(`/services/thai-economap/site-contents/${key}`), {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load site content "${key}": HTTP ${res.status}`);
  const { data } = await res.json();

  return data.strings;
}
