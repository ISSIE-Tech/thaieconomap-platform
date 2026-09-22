import { useState } from 'react';
import Image from 'next/image';

import {
  BackDrawerButton,
  IconButton,
  ProfileIconButton,
} from '@/components/button';
import { UserSubmissionType } from '@/types/post';
import { formatCardDate } from '@/services/date';
import { useUserStore } from '@/store';

import { Drawer } from '@mui/material';
import { InformationBox, InformationLabel } from '@/components/information-box';
import { formatDateThai, formatPhoneNumber } from '@/utils/form';
import { SwiperDrawer } from '@/components/drawer';
import { useAuth } from '@/auth/useAuth';
import axios from '@/utils/axios';
import { SubmissionBadge } from '@/components/badge';

export default function UserSubmissionDrawer() {
  const userSubmissions = useUserStore((state) => state.userSubmissions);

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <ProfileIconButton
        icon="/assets/icons/profile/Registered.svg"
        label="ดูประวัติสมัครงานทั้งหมด"
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

        <section className="mt-6">
          <h1 className="text-2xl text-granite-100 font-semibold">
            ประวัติสมัครงาน
          </h1>
        </section>

        <section>
          <h4 className="text-ink text-lg mt-6">
            งานที่สมัครล่าสุด (
            {userSubmissions?.filter((s) => s.jobPost)?.length || ''})
          </h4>
          <div className="space-y-4 py-4">
            {userSubmissions.map(
              (submission) =>
                submission?.jobPost && (
                  <SubmissionDrawer
                    key={submission._id}
                    submission={submission}
                  />
                )
            )}
          </div>
        </section>
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

type Props = {
  submission: UserSubmissionType;
};

function SubmissionCard({ submission }: Props) {
  return (
    <div className="border rounded-lg border-mist px-4 py-6 text-left bg-white">
      <div>
        <h1 className="font-bold text-lg truncate">
          {submission?.jobPost?.title}
        </h1>
        <p className="mt-2 line-clamp-2 min-h-[3rem]">
          {submission?.jobPost?.description || 'ไม่ทราบ'}
        </p>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <span className="text-main-green text-sm">
            {submission?.jobPost?.category?.name || 'ไม่ทราบ'}
          </span>
          <span className="ml-2 text-granite-50 text-sm">
            สมัครวันที่ {formatCardDate(new Date(submission?.createdAt))}
          </span>
        </div>
        <div>
          <SubmissionBadge submissionStatus={submission?.status} />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function SubmissionDrawer({ submission }: Props) {
  const { user } = useAuth();

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  // ----------------------------------------------------------------------

  return (
    <>
      <button onClick={toggleDrawer(true)} className="w-full">
        <SubmissionCard submission={submission} />
      </button>

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
        <BackDrawerButton toggleDrawer={toggleDrawer} label="กลับ" />

        <section className="mt-6">
          <h1 className="text-2xl text-granite-100 font-semibold">
            {submission?.jobPost?.title}
          </h1>
        </section>

        <InformationBox title="ข้อมูลส่วนตัวผู้สมัคร">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.profileImageUrl}
            alt="user"
            className="w-16 h-16 rounded-full border border-main-green"
          />
          <InformationLabel title="ชื่อ-สกุล" desc={user?.name || 'ไม่ทราบ'} />
          <InformationLabel
            title="เกิดวันที่"
            desc={user?.birthDate ? formatDateThai(user?.birthDate) : 'ไม่ทราบ'}
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(user?.phoneNumber)}
          />
          <InformationLabel
            title="เคยประกอบอาชีพ"
            desc={user?.experiences || 'ไม่ทราบ'}
          />
        </InformationBox>

        <InformationBox title="เพิ่มเติม">
          <InformationLabel
            title="ข้อความเพิ่มเติม"
            desc={submission?.additionalInformation || 'ไม่มีข้อความเพิ่มเติม'}
          />
        </InformationBox>

        <section className="flex gap-6 mt-4">
          <a href={`tel:${user?.phoneNumber}`} className="w-full">
            <IconButton
              image="/assets/icons/home/Call.svg"
              label="ติดต่อ"
              callback={() => {}}
            />
          </a>

          {submission?.status === 'PENDING' && (
            <CancelSwiperDrawer submission={submission} />
          )}
        </section>

        <InformationBox title="ต้องการสมัครงาน">
          <InformationLabel title="ชื่องาน" desc={submission?.jobPost?.title} />
          <InformationLabel
            title="คุณสมบัติ"
            desc={submission?.jobPost?.qualification || 'ไม่ทราบ'}
          />
          <InformationLabel
            title="ค่าตอบแทน"
            desc={`${submission?.jobPost?.wage?.amount} ${submission?.jobPost?.wage?.unit}`}
          />
          <InformationLabel
            title="ผู้ว่าจ้าง"
            desc={submission?.jobPost?.createdBy?.name || 'ไม่ทราบ'}
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(
              submission?.jobPost?.createdBy?.phoneNumber || ''
            )}
          />
        </InformationBox>

        {/* <ReportDrawer /> */}
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function CancelSwiperDrawer({ submission }: Props) {
  const userSubmissions = useUserStore((state) => state.userSubmissions);
  const setUserSubmissions = useUserStore((state) => state.setUserSubmissions);

  const [cancelSuccess, setCancelSuccess] = useState(false);

  const closeButton = (
    <IconButton
      image="/assets/icons/home/Close.svg"
      label="ยกเลิก"
      callback={() => {}}
    />
  );

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `/users/profile/submissions/${submission._id}/cancel`
      );

      const updateSubmission = res.data.submission;
      setUserSubmissions([
        ...userSubmissions.map((submission) =>
          submission._id === updateSubmission._id
            ? updateSubmission
            : submission
        ),
      ]);

      setCancelSuccess(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <SwiperDrawer
        label=""
        onCancel={() => {}}
        onSave={handleSave}
        button={closeButton}
        saveLabel="ยืนยัน"
        isValid={cancelSuccess}
      >
        <header className="mb-4">
          <h1 className="font-bold text-lg">ยืนยันที่จะยกเลิกการสมัคร</h1>
        </header>

        <p className="text-lg text-granite-50">
          หากยืนยันยกเลิกสมัครงานนี้ คุณจะไม่สามารถกลับมาแก้ไขข้อมูลได้อีก
        </p>
      </SwiperDrawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function ReportDrawer() {
  const handleSave = async () => {};

  return (
    <>
      <section className="fixed bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
        <button className="btn btn-solid w-full" onClick={() => {}}>
          รายงานปัญหา
        </button>
      </section>

      <div>
        <SwiperDrawer label="xxx" onCancel={() => {}} onSave={handleSave}>
          <h1>Hello World</h1>
        </SwiperDrawer>
      </div>
    </>
  );
}
