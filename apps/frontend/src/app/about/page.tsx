import 'src/modules/about/about.css';

import type { Metadata } from 'next';

import { AboutScript } from 'src/modules/about/about-script';
import { getSiteContent } from 'src/modules/site-content/get-site-content';
import { renderAbout, type AboutLang } from 'src/modules/about/render-about';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา | Thai Economap',
  description:
    'ThaiEconoMap: โครงสร้างพื้นฐานดิจิทัลเพื่อเศรษฐกิจฐานรากและสุขภาวะชุมชน โดยสถาบันเอเชียศึกษา จุฬาลงกรณ์มหาวิทยาลัย สนับสนุนโดย สสส.',
};

type Props = { searchParams: Promise<{ lang?: string }> };

export default async function AboutPage({ searchParams }: Props) {
  const lang: AboutLang = (await searchParams).lang === 'en' ? 'en' : 'th';
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
