import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'ประกาศข่าวสารในพื้นที่',
  description: 'ประกาศและข่าวสารจากหน่วยงานในพื้นที่ ค้นหาตามจังหวัด อำเภอ และวันที่',
  alternates: { canonical: '/announcements' },
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
