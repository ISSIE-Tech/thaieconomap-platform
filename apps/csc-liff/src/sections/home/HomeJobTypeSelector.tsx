import { useState } from 'react';
import Image from 'next/image';
import { BackDrawerButton } from '@/components/button';
import JobPostDrawer from '@/components/JobPostDrawer';
import IconButton from '@/components/button/IconButton';
import { PostType } from '@/types/post';
import { usePostStore } from '@/store';
import { Drawer } from '@mui/material';

export default function HomeJobTypeSelector() {
  const posts = usePostStore((state) => state.posts);
  const categories = usePostStore((state) => state.categories);

  return (
    <div className="px-6 mt-6">
      <h1 className="text-lg text-ink">เลือกประเภทงาน</h1>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {categories
          .filter((category) => category.isMain)
          .sort((a, b) => (a.index || 0) - (b.index || 0))
          .map((category) => (
            <JobTypeSelectorDrawer
              key={category._id}
              image={category.iconUrl}
              label={category.name}
              jobPosts={posts.filter(
                (post) => post.category._id === category._id
              )}
            />
          ))}

        <OtherJobsCategoryDrawer />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

type JobTypeSelectorDrawerProps = {
  image: string;
  label: string;
  jobPosts: PostType[];
};

function JobTypeSelectorDrawer({
  image,
  label,
  jobPosts,
}: JobTypeSelectorDrawerProps) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  return (
    <>
      {/* Toggle Button */}
      <IconButton image={image} label={label} callback={toggleDrawer(true)} />

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: '100vw', padding: '1rem 1.5rem', overflowX: 'hidden' },
        }}
      >
        <BackDrawerButton label="กลับหน้าหลัก" toggleDrawer={toggleDrawer} />

        {/* BackDrop Icon */}
        {jobPosts.length ? (
          <Image
            src="/assets/illustrations/PostsBoard.svg"
            alt="backdrop icon"
            width={120}
            height={120}
            className="absolute top-1.5 right-1.5 -z-10"
          />
        ) : (
          <></>
        )}

        <section>
          <h1 className="text-2xl font-bold mt-8">งาน{label}</h1>
          <div className="mt-4">
            {jobPosts.length ? (
              jobPosts.map((post) => (
                <JobPostDrawer key={post._id} post={post} />
              ))
            ) : (
              <div className="flex flex-col items-center gap-10 my-10">
                <Image
                  src="/assets/illustrations/Net.svg"
                  alt="Search Not Found"
                  width={300}
                  height={300}
                  className="relative left-6"
                />

                <h1 className="font-semibold text-lg text-center">
                  ไม่พบข้อมูล
                </h1>
              </div>
            )}
          </div>
        </section>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function OtherJobsCategoryDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const posts = usePostStore((state) => state.posts);
  const categories = usePostStore((state) => state.categories);

  // ----------------------------------------------------------------------

  return (
    <>
      {/* Toggle Button */}
      <IconButton
        image={'/assets/icons/home/OthersType.svg'}
        label="งานอื่นๆ"
        callback={toggleDrawer(true)}
      />

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: '100vw', padding: '1rem 1.5rem', overflowX: 'hidden' },
        }}
      >
        <BackDrawerButton label="กลับหน้าหลัก" toggleDrawer={toggleDrawer} />

        <section>
          <h1 className="text-2xl font-semibold mt-8">ประเภทงานอื่นๆ</h1>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {categories
              .filter((category) => !category.isMain)
              .sort((a, b) =>
                a.name > b.name ? 1 : a.name === b.name ? 0 : -1
              )
              .map((category) => (
                <JobTypeSelectorDrawer
                  key={category._id}
                  image={category.iconUrl}
                  label={category.name}
                  jobPosts={posts.filter(
                    (post) => post.category._id === category._id
                  )}
                />
              ))}
          </div>
        </section>
      </Drawer>
    </>
  );
}
