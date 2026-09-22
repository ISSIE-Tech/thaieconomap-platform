import Image from 'next/image';
import React from 'react';
import RegisterDrawer from './RegisterDrawer';

export default function Register() {
  return (
    <div className="w-screen h-screen p-6 flex justify-center items-center bg-paper-100">
      <div className="w-full">
        <div className="flex justify-center">
          <Image
            src="/assets/illustrations/Landing.svg"
            alt="Landing"
            width={400}
            height={400}
          />
        </div>

        <h1 className="text-center mt-6 text-3xl font-semibold">
          หางานที่ใช่สำหรับคุณ
        </h1>
        <p className="text-center mt-6 mb-12 text-lg text-ink">
          ให้เราช่วยแมทช์งานให้ตรงกับ <br />
          ความต้องการของคุณมากที่สุด
        </p>

        <RegisterDrawer />
      </div>
    </div>
  );
}
