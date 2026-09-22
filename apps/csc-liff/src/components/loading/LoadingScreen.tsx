import Image from 'next/image';
import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Image
        src="/assets/illustrations/Landing.svg"
        alt="landing loading"
        width={260}
        height={260}
      />

      {/* <p className="text-center font-bold text-lg">
        โปรดรอสักครู่ <br />
        เรากำลังหางานให้คุณ...
      </p> */}
    </div>
  );
}
