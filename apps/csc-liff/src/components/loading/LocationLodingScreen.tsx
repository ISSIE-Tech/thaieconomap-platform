import Image from 'next/image';

export default function LocationLodingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        src="/assets/illustrations/Landing.svg"
        alt="landing loading"
        width={260}
        height={260}
      />

      <h1 className="text-lg font-semibold mb-2 text-center">
        กำลังค้นหาตำแหน่ง
      </h1>
      <p className="text-center">
        หากใช้เวลาเกิน 10 วินาทีกรุณาปิดเปิดตำแหน่งใหม่
      </p>
    </div>
  );
}
