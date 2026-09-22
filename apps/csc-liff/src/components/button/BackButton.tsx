import React from 'react';
import Image from 'next/image';

type Props = {
  label: string;
  handleClick: () => void;
};

const BackButton = ({ label, handleClick }: Props) => {
  return (
    <button className="flex items-center gap-0.5" onClick={handleClick}>
      <Image
        src="/assets/icons/drawer/ArrowLeft.svg"
        alt="Landing"
        width={24}
        height={24}
      />
      <p className="text-granite-50 text-lg">{label}</p>
    </button>
  );
};

export default BackButton;
