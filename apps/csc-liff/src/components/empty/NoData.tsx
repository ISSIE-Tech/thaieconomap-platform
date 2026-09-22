import Image from 'next/image';

type Props = {
  label: string;
};

export default function NoData({ label }: Props) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src="/assets/illustrations/Net.svg"
        alt="Search Not Found"
        width={200}
        height={200}
        className="relative left-6"
      />
      <h2 className="text-lg mt-6 text-ink">{label}</h2>
    </div>
  );
}
