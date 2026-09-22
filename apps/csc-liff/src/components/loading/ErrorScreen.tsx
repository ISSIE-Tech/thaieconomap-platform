import Image from 'next/image';

export default function ErrorScreen() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        src="/assets/illustrations/Landing.svg"
        alt="landing loading"
        width={260}
        height={260}
        className=""
      />

      <h1 className="text-lg text-main-red  text-center font-semibold">
        โปรดเปิดเว็บไซต์ใหม่อีกครั้ง
      </h1>
      <h2 className="text-base font-semibold text-center mt-1">
        ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้
      </h2>
    </div>
  );
}
