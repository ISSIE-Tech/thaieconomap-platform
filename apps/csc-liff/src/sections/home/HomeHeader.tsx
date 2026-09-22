/* eslint-disable @next/next/no-img-element */

import { useAuth } from '@/auth/useAuth';
import Link from 'next/link';

export default function HomeHeader() {
  const { user } = useAuth();

  return (
    <div className="bg-main-green p-6 flex">
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <img
            src={
              user?.profileImageUrl
                ? user?.profileImageUrl
                : 'https://img.freepik.com/premium-vector/cute-panda-wall-cartoon_42750-675.jpg?w=2000'
            }
            alt="panda"
            className="rounded-full w-12"
          />
        </Link>
        <p className="text-lg text-white font-semibold">หางานไหนอยู่</p>
      </div>
      <div></div>
    </div>
  );
}
