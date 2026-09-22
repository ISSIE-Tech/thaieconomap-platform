import React from 'react';
import Image from 'next/image';
import { BackDrawerButtonType } from './types';

export default function BackDrawerButton({
  label,
  toggleDrawer,
}: BackDrawerButtonType) {
  return (
    <button className="flex items-center gap-0.5" onClick={toggleDrawer(false)}>
      <Image
        src="/assets/icons/drawer/ArrowLeft.svg"
        alt="Landing"
        width={24}
        height={24}
      />
      <p className="text-granite-50 text-lg">{label}</p>
    </button>
  );
}
