/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/auth/useAuth';
import { BackButton } from '@/components/button';

export default function ProfileInformation() {
  const { user } = useAuth();

  return (
    <section className="bg-cloud px-6 py-4">
      <Link href="/">
        <BackButton label="กลับหน้าหลัก" handleClick={() => {}} />
      </Link>

      <div className="flex flex-col items-center pt-11 pb-8">
        <img
          src={
            user?.profileImageUrl
              ? user?.profileImageUrl
              : 'https://img.freepik.com/premium-vector/cute-panda-wall-cartoon_42750-675.jpg?w=2000'
          }
          alt="user-image"
          className="rounded-full w-20 border-2 border-main-green"
        />
        <h1 className="text-xl font-bold mt-4">
          {user?.name || 'ไม่มีชื่อผู้ใช้'}
        </h1>
        <p className="text-center text-sm text-granite-50 mt-1">
          ID: {user?.shortId || 'ไม่มี ID'}
        </p>
      </div>
    </section>
  );
}
