import type { Metadata } from 'next';

import { LegalPage } from 'src/modules/legal/legal-page';
import { getSiteContent } from 'src/modules/site-content/get-site-content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ข้อกำหนดการใช้งาน',
  alternates: { canonical: '/terms' },
};

export default async function TermsPage() {
  return <LegalPage content={await getSiteContent('terms')} />;
}
