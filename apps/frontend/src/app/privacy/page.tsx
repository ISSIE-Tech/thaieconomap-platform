import type { Metadata } from 'next';

import { LegalPage } from 'src/modules/legal/legal-page';
import { getSiteContent } from 'src/modules/site-content/get-site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว',
  alternates: { canonical: '/privacy' },
};

export default async function PrivacyPage() {
  return <LegalPage content={await getSiteContent('privacy')} />;
}
