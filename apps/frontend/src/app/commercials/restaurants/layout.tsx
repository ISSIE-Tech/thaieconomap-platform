import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'แผนที่ร้านอาหารในชุมชน',
  description: 'ค้นหาร้านอาหารในชุมชนใกล้คุณบนแผนที่ ดูเวลาเปิด-ปิด เบอร์โทร และเส้นทาง สนับสนุนร้านเล็กในท้องถิ่น',
  alternates: { canonical: '/commercials/restaurants' },
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
