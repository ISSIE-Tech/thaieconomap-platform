import React from 'react';

type Props = {
  title: string;
  desc: string;
};

export default function InformationLabel({ title, desc }: Props) {
  return (
    <span className="flex flex-col gap-2">
      <p className="text-sm text-granite-50">{title}</p>
      <p className="text-sm text-granite-100 bg-paper-100 pl-1 py-0.5 whitespace-pre-line">
        {desc}
      </p>
    </span>
  );
}
