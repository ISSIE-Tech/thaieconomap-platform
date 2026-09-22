import React, { useState } from 'react';
import Image from 'next/image';

import CreatePostFirstForm, { FirstFormDataType } from './CreatePostFirstForm';
import CreatePostSecondForm, {
  SecondFormDataType,
} from './CreatePostSecondForm';
import CreatePostThirdForm from './CreatePostThirdForm';

import { formatNewPostData } from '@/services/form';
import axios from '@/utils/axios';
import { usePostStore } from '@/store';
import { Drawer } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

export default function HomeNewPost() {
  const categories = usePostStore((state) => state.categories);
  const { enqueueSnackbar } = useSnackbar();

  // ----------------------------------------------------------------------

  const [forms, setForms] = useState({});
  const [success, setSuccess] = useState(false);

  const [firstFormOpen, setFirstFormOpen] = useState(false);
  const [secondFormOpen, setSecondFormOpen] = useState(false);
  const [thirdFormOpen, setThirdFormOpen] = useState(false);

  const handleFirstFormSubmit = async (data: FirstFormDataType) => {
    setForms((prev) => ({ ...prev, ...data }));
    setSecondFormOpen(true);
  };

  const handleSecondFormSubmit = async (data: SecondFormDataType) => {
    setForms((prev) => ({ ...prev, ...data }));
    setThirdFormOpen(true);
  };

  const handleThirdFormSubmit = async (data: any) => {
    const formData = { ...forms, ...data };

    // Change category id to category name
    formData.category = categories.find(
      (category) => category.name === formData.category
    )?._id;

    const formatedData = await formatNewPostData(formData);

    try {
      await axios.post('/pending-job-posts', formatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
    } catch (error) {
      console.log({ error });
      enqueueSnackbar('เกิดข้อผิดพลาด', { variant: 'error' });
    }
  };

  // ----------------------------------------------------------------------

  return (
    <div className="mt-4 px-6 pb-20">
      <div className="flex flex-col items-center">
        <Image
          src="assets/illustrations/Agenda.svg"
          alt="agenda"
          width={132}
          height={144}
        />
        <p className="text-center text-lg mt-2">
          กำลังหาคนทำงานให้อยู่หรือเปล่า?
        </p>
      </div>

      <CreatePostFirstForm
        open={firstFormOpen}
        setOpen={setFirstFormOpen}
        onSubmit={handleFirstFormSubmit}
      />

      <CreatePostSecondForm
        open={secondFormOpen}
        setOpen={setSecondFormOpen}
        onSubmit={handleSecondFormSubmit}
      />

      <CreatePostThirdForm
        open={thirdFormOpen}
        setOpen={setThirdFormOpen}
        onSubmit={handleThirdFormSubmit}
      />

      <CreatePostSuccessDrawer open={success} setOpen={setSuccess} />
    </div>
  );
}

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function CreatePostSuccessDrawer({ open, setOpen }: Props) {
  const router = useRouter();

  // ----------------------------------------------------------------------

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  const handleRedirectHome = () => {
    router.push('/profile');
  };

  // ----------------------------------------------------------------------

  return (
    <Drawer
      transitionDuration={0}
      open={open}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: '100vw',
          overflowX: 'hidden',
          padding: '1rem 1.5rem',
        },
      }}
    >
      <div className="h-full flex flex-col justify-center items-center gap-10">
        <Image
          src="/assets/illustrations/Directing.svg"
          alt="landing loading"
          width={260}
          height={260}
        />

        <p className="text-center font-bold text-lg">
          ขอบคุณที่สร้างประกาศกับเรา!​ <br />
          รอการยืนยันภายใน 24 ชั่วโมง
        </p>
      </div>

      <section className="relative right-6 w-screen mt-7 px-6 py-4 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
        <button className="btn btn-solid w-full" onClick={handleRedirectHome}>
          กลับไปดูรายละเอียด
        </button>
      </section>
    </Drawer>
  );
}
