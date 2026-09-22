import Image from 'next/image';
import React from 'react';
import { classNames } from '@/utils/className';

type Props = {
  icon: string;
  label: string;
  handleClick: () => void;
  disabled?: boolean;
};

const ProfileIconButton = ({
  icon,
  label,
  handleClick,
  disabled = false,
}: Props) => {
  return (
    <button
      onClick={handleClick}
      className={classNames(
        'w-full p-4 rounded-lg border border-mist flex items-center gap-4',
        disabled ? 'bg-cloud text-granite-50' : ''
      )}
    >
      <Image
        src={icon}
        alt="icon"
        width={30}
        height={30}
        className={disabled ? 'grayscale' : ''}
      />
      <p className="font-bold text-granit-100">{label}</p>
    </button>
  );
};

export default ProfileIconButton;
