import React, { PropsWithChildren } from 'react';

type Props = {
  title: string;
};

export default function InformationBox({
  children,
  title,
}: PropsWithChildren<Props>) {
  return (
    <section className="mt-6 px-4 py-6 border border-mist rounded-lg flex flex-col gap-2 bg-white">
      <h1 className="font-bold text-lg">{title}</h1>

      {children}
    </section>
  );
}
