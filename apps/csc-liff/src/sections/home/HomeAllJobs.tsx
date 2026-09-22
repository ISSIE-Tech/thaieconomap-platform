import { useState } from 'react';

import JobPostDrawer from '@/components/JobPostDrawer';
import { BackDrawerButton } from '@/components/button';
import { NoData } from '@/components/empty';
import { usePostStore } from '@/store';

import { Drawer } from '@mui/material';
import Image from 'next/image';

export default function HomeAllJobs() {
  const posts = usePostStore((state) => state.posts);

  return (
    <div className="px-6 mt-8 pb-20">
      <h2 className="text-lg text-ink">ประกาศงานทั้งหมด</h2>

      <div className="mt-6">
        {posts.length == 0 ? <NoData label="ยังไม่มีประกาศงาน" /> : null}
        {posts.slice(0, 6).map((post) => (
          <JobPostDrawer key={post._id} post={post} />
        ))}
      </div>

      {posts.length > 0 && <AllJobsDrawer />}
    </div>
  );
}

// ----------------------------------------------------------------------

function AllJobsDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const posts = usePostStore((state) => state.posts);

  return (
    <>
      <div className="flex justify-center items-center mt-4 pb-6 border-b border-line">
        <button
          className="text-main-orange text-lg font-bold"
          onClick={toggleDrawer(true)}
        >
          กดเพื่อดูประกาศทั้งหมด
        </button>
      </div>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 4rem',
          },
        }}
      >
        <BackDrawerButton label="กลับหน้าหลัก" toggleDrawer={toggleDrawer} />

        <Image
          src="/assets/illustrations/PostsBoard.svg"
          alt="backdrop icon"
          width={132}
          height={120}
          className="absolute top-1.5 right-1.5 -z-10"
        />

        <section>
          <h1 className="text-2xl font-semibold mt-8">งานทั้งหมด</h1>
          <div className="mt-4">
            {posts.map((post) => (
              <JobPostDrawer key={post._id} post={post} />
            ))}
          </div>
        </section>
      </Drawer>
    </>
  );
}
