'use client';

import type { BaseBtnProps } from './base-btn';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BaseBtn from './base-btn';

// -------------------------------------------------------------

export function BackBtn({ onClick, sx }: BaseBtnProps) {
  const router = useRouter();

  return (
    <BaseBtn onClick={onClick ?? router.back} sx={sx}>
      <Image src="/assets/icons/back-btn.svg" alt="menu button" width="40" height="40" />
    </BaseBtn>
  );
}
