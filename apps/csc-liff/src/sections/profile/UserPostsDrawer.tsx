import React, { useState } from 'react';
import Image from 'next/image';

import { BackDrawerButton, ProfileIconButton } from '@/components/button';
import { NoData } from '@/components/empty';
import JobPendingDrawer from '@/components/JobPendingDrawer';
import JobOpeningDrawer from '@/components/JobOpeningDrawer';
import JobRejectedDrawer from '@/components/JobRejectedDrawer';
import { useUserStore } from '@/store';

import { Drawer } from '@mui/material';

export default function UserPostsDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  return (
    <div>
      <ProfileIconButton
        icon="/assets/icons/profile/Announce.svg"
        label="ดูประกาศงานของคุณ"
        handleClick={toggleDrawer(true)}
      />

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 2rem',
          },
        }}
      >
        <BackDrawerButton toggleDrawer={toggleDrawer} label="กลับหน้าหลัก" />

        <Image
          src="/assets/illustrations/PostsBoard.svg"
          alt="backdrop icon"
          width={120}
          height={120}
          className="absolute top-4 right-1.5 -z-10"
        />

        <section className="mt-12">
          <h1 className="text-2xl text-granite-100 font-semibold">
            ประกาศงานของคุณ
          </h1>
        </section>

        <PendingPostSection />

        <OpeningPostSection />
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function PendingPostSection() {
  const userPosts = useUserStore((state) => state.userPosts);

  const pendingPosts = userPosts.filter(
    (post) => post.submissionStatus === 'PENDING'
  );

  const pendingPostsCards = pendingPosts.map((post) => (
    <JobPendingDrawer key={post._id} post={post} />
  ));

  const rejectedPosts = userPosts.filter(
    (post) => post.submissionStatus === 'REJECTED'
  );

  const rejectPostsCards = rejectedPosts.map((post) => (
    <JobRejectedDrawer key={post._id} post={post} />
  ));

  return (
    <section className="mt-6">
      <h2 className="text-ink text-lg">
        รอการยืนยันจากระบบภายใน <span className="font-bold">24</span> ชม.
      </h2>

      {/* Pending lists */}
      <div className="mt-4 space-y-4">
        {pendingPosts.length === 0 && rejectedPosts.length === 0 ? (
          <NoData label="ไม่มีประกาศงานที่รอยืนยัน" />
        ) : null}
        {pendingPosts.length !== 0 ? pendingPostsCards : null}
        {rejectedPosts.length !== 0 ? rejectPostsCards : null}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------

function OpeningPostSection() {
  const userPosts = useUserStore((state) => state.userPosts);

  const openingPosts = userPosts.filter(
    (post) => post.submissionStatus === 'APPROVED'
  );

  const openingPostsCards = openingPosts.map((post) => (
    <JobOpeningDrawer key={post._id} post={post} />
  ));

  return (
    <section className="my-6">
      <h2 className="text-ink text-lg">เปิดรับอยู่</h2>

      <div className="mt-4 space-y-4">
        {openingPosts.length === 0 ? (
          <NoData label="ยังไม่มีประกาศงานที่เปิดอยู่" />
        ) : (
          openingPostsCards
        )}
      </div>
    </section>
  );
}
