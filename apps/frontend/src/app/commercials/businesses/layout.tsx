import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'แผนที่ธุรกิจในชุมชน',
  description: 'ค้นหาธุรกิจและบริการในชุมชนใกล้คุณ ร้านซ่อม ร้านค้า และบริการท้องถิ่น พร้อมเวลาทำการ เบอร์โทร และเส้นทาง',
  alternates: { canonical: '/commercials/businesses' },
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
