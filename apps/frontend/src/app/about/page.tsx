import 'src/modules/about/about.css';

import type { Metadata } from 'next';

import { OPEN_GRAPH } from 'src/shared/seo';
import { AboutScript } from 'src/modules/about/about-script';
import { getSiteContent } from 'src/modules/site-content/get-site-content';
import { renderAbout, type AboutLang } from 'src/modules/about/render-about';

export const dynamic = 'force-dynamic';

const DESCRIPTION = {
  th: 'ThaiEconoMap: โครงสร้างพื้นฐานดิจิทัลเพื่อเศรษฐกิจฐานรากและสุขภาวะชุมชน โดยสถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย สนับสนุนโดย สสส.',
  en: 'ThaiEconoMap: digital infrastructure for the grassroots economy and community wellbeing, by the Institute of Asian Studies, Chulalongkorn University, supported by ThaiHealth.',
};

type Props = { searchParams: Promise<{ lang?: string }> };

const langOf = async (searchParams: Props['searchParams']): Promise<AboutLang> =>
  (await searchParams).lang === 'en' ? 'en' : 'th';

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = await langOf(searchParams);

  return {
    title: lang === 'en' ? 'About' : 'เกี่ยวกับเรา',
    description: DESCRIPTION[lang],
    alternates: {
      canonical: lang === 'en' ? '/about?lang=en' : '/about',
      languages: { th: '/about', en: '/about?lang=en', 'x-default': '/about' },
    },
    openGraph: {
      ...OPEN_GRAPH,
      title: lang === 'en' ? 'About ThaiEconoMap' : 'เกี่ยวกับ ThaiEconoMap',
      description: DESCRIPTION[lang],
      locale: lang === 'en' ? 'en_US' : 'th_TH', url: lang === 'en' ? '/about?lang=en' : '/about' },
  };
}

export default async function AboutPage({ searchParams }: Props) {
  const lang = await langOf(searchParams);
  const strings = await getSiteContent('about');

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600&display=swap"
        precedence="default"
      />
      { }
      <div className="tem-about" lang={lang} dangerouslySetInnerHTML={{ __html: renderAbout(strings, lang) }} />
      <AboutScript lang={lang} />
    </>
  );
}
