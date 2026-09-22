import React from 'react';
import { ProfileIconButton } from '@/components/button';
import UserPostsDrawer from './UserPostsDrawer';
import UserSubmissionDrawer from './UserSubmissionDrawer';

export default function ProfileContent() {
  return (
    <section className="bg-cloud grow overflow-y-scroll">
      <div className="bg-white min-h-full rounded-t-xl px-6 py-8 space-y-4">
        <UserSubmissionDrawer />

        <UserPostsDrawer />

        <div className="border-t-2 !my-7"></div>

        <ProfileIconButton
          icon="/assets/icons/profile/Friend.svg"
          label="ชวนเพื่อน"
          handleClick={() => {}}
          disabled
        />
        <ProfileIconButton
          icon="/assets/icons/profile/Information.svg"
          label="เกี่ยวกับเชี่ยวแชร์"
          handleClick={() => {}}
          disabled
        />
      </div>
    </section>
  );
}
