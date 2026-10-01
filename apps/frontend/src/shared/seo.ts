import type { Metadata } from 'next';

// Site-wide SEO constants. Only production sets NEXT_PUBLIC_SITE_URL; every other build
// is kept out of search indexes (robots.txt disallow + noindex meta).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const IS_INDEXABLE = !!process.env.NEXT_PUBLIC_SITE_URL;

export const SITE_NAME = 'Thai Economap';
export const SITE_NAME_TH = 'แผนที่เศรษฐกิจชุมชน';
export const SITE_DESCRIPTION =
  'แผนที่เศรษฐกิจชุมชน ค้นหาร้านอาหาร ธุรกิจในชุมชน รถพุ่มพวง งานและอาชีพ และการแบ่งปันสิ่งของใกล้คุณ ' +
  'โครงการของสถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย สนับสนุนโดย สสส.';

// Next replaces (not merges) a parent's openGraph, so pages that set their own spread this in.
export const OPEN_GRAPH: NonNullable<Metadata['openGraph']> = {
  type: 'website',
  siteName: SITE_NAME,
  locale: 'th_TH',
  images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE_NAME_TH }],
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

/** Serialize JSON-LD for a <script> tag; escaping "<" keeps CMS/shop text from closing the tag. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') });
