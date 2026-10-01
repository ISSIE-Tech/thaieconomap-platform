import { paths } from 'src/shared/routes/paths.config';
import { getShops } from 'src/modules/shop-page/shop.server';
import { SITE_NAME, absoluteUrl, SITE_NAME_TH, SITE_DESCRIPTION } from 'src/shared/seo';

// llms.txt (https://llmstxt.org): a plain-markdown map of the site for AI agents and answer engines.
export const revalidate = 3600;

export async function GET() {
  const shops = await getShops();
  const list = (category: string) =>
    shops
      .filter((s) => s.category === category)
      .map((s) => `- [${s.name.replace(/[[\]]/g, '')}](${absoluteUrl(paths.shop(s._id))})`)
      .join('\n');

  const body = `# ${SITE_NAME} (${SITE_NAME_TH})

> ${SITE_DESCRIPTION}

Thai Economap is a free, non-profit community economy map for Thailand. It lists small local restaurants and businesses (with opening hours, phone numbers and map locations), live locations of mobile grocery trucks (รถพุ่มพวง), local job postings, item sharing between neighbours, and local announcements. Content is in Thai.

## Main pages

- [ร้านอาหาร / Restaurants map](${absoluteUrl(paths.commercials.restaurants)}): community restaurants on a map
- [ธุรกิจ / Local businesses map](${absoluteUrl(paths.commercials.businesses)}): repair shops, services and other small businesses
- [รถพุ่มพวง / Mobile grocery trucks](${absoluteUrl(paths.commercials.pumpuang)}): live truck locations
- [งานและอาชีพ / Jobs](${absoluteUrl(paths.jobs)}): local job postings
- [ช่วยเหลือแบ่งปัน / Item sharing](${absoluteUrl(paths.sharings)}): free items shared between neighbours
- [ประกาศ / Announcements](${absoluteUrl(paths.announcements.root)}): announcements from local agencies
- [เกี่ยวกับเรา / About](${absoluteUrl(paths.about)}): the project, its ideas and who runs it

## Restaurants

${list('RESTAURANT')}

## Local businesses

${list('BUSINESS')}

## Optional

- [ข้อกำหนดการใช้งาน / Terms of use](${absoluteUrl(paths.legal.terms)})
- [นโยบายความเป็นส่วนตัว / Privacy policy](${absoluteUrl(paths.legal.privacy)})
- [Sitemap](${absoluteUrl('/sitemap.xml')})
`;

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
