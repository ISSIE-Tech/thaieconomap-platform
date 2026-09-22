import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BackDrawerButton } from '@/components/button';
import JobPostDrawer from '@/components/JobPostDrawer';
import { usePostStore } from '@/store';
import { Drawer } from '@mui/material';

export default function HomeSearchBox() {
  return (
    <div className="bg-main-green">
      <div className="bg-white px-6 pt-6 rounded-t-lg">
        <h1 className="text-2xl text-granite-100 font-bold">
          เลือกดูงานที่มีตอนนี้
        </h1>

        <HomeSearchDrawer />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function HomeSearchDrawer() {
  const posts = usePostStore((state) => state.posts);
  const [filterPosts, setFilterPosts] = useState(posts);
  const [search, setSearch] = useState('');

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  const handleClose = (state: boolean) => () => {
    setSearch('');
    setFilterPosts(posts);
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!search) {
      return setFilterPosts(posts);
    }

    const filtered = posts.filter((post) =>
      [post.title, post.description]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilterPosts(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    setFilterPosts(posts);
  }, [posts]);

  // ----------------------------------------------------------------------

  return (
    <>
      {/* Toggle Button */}
      <button
        className="w-full mt-4 border border-[#C4C4C4] bg-paper-100 py-4 px-5 rounded-lg flex items-center gap-2.5"
        onClick={toggleDrawer(true)}
      >
        <Image
          src="/assets/icons/home/Search.svg"
          alt="search"
          width={18}
          height={18}
        />
        <p className="text-granite-50 relative top-[1px]">
          พิมพ์ค้นหารายละเอียดงาน
        </p>
      </button>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: '100vw', padding: '1rem 1.5rem', overflowX: 'hidden' },
        }}
      >
        <BackDrawerButton label="กลับหน้าหลัก" toggleDrawer={handleClose} />

        <section className="mt-6">
          <h1 className="text-2xl text-granite-100 font-semibold">
            พิมพ์ค้นหางาน
          </h1>

          <input
            value={search}
            autoFocus
            ref={inputRef}
            onKeyDown={handleKeyDown as any}
            placeholder="พิมพ์ค้นหารายละเอียดงาน"
            className="w-full mt-1 px-4 py-4 border border-granite-50/50 rounded"
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section className="mt-8">
          <h4>ผลการค้นหา</h4>

          <div className="mt-4">
            {filterPosts.length ? (
              filterPosts.map((post) => (
                <JobPostDrawer key={post._id} post={post} />
              ))
            ) : (
              <NoMatchFound />
            )}
          </div>
        </section>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function NoMatchFound() {
  return (
    <div className="flex flex-col items-center gap-10 my-10">
      <Image
        src="/assets/illustrations/Net.svg"
        alt="Search Not Found"
        width={300}
        height={300}
        className="relative left-6"
      />

      <h1 className="font-semibold text-lg text-center">
        ไม่พบข้อมูล <br />
        ลองพิมพ์คำค้นหาอื่น
      </h1>
    </div>
  );
}
