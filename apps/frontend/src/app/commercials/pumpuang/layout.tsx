import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'รถพุ่มพวงใกล้คุณ',
  description: 'ดูตำแหน่งรถพุ่มพวง (รถเร่ขายของสด) แบบเรียลไทม์บนแผนที่ รู้ว่ารถอยู่ไหนและกำลังมาเมื่อไร',
  alternates: { canonical: '/commercials/pumpuang' },
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
