import React, { useState } from 'react';
import Image from 'next/image';
import { BadgeStatus } from './badge';
import { BackDrawerButton, IconButton } from './button';
import { InformationBox, InformationLabel } from './information-box';
import EditOpeningJobDrawer from './EditOpeningJobDrawer';
import { SubmissionType, UserPostType } from '@/types/post';
import { formatDateThai, formatPhoneNumber } from '@/utils/form';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Drawer,
  styled,
} from '@mui/material';
import { NoData } from './empty';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from '@/utils/axios';
import { useUserStore } from '@/store';
import { formatCardDate } from '@/services/date';

type Props = {
  post: UserPostType;
};

export default function JobOpeningDrawer({ post }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <button onClick={toggleDrawer(true)} className="w-full">
        <JobOpeningCard post={post} />
      </button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 7rem',
          },
        }}
      >
        <BackDrawerButton
          label="กลับหน้าประกาศงาน"
          toggleDrawer={toggleDrawer}
        />

        <header className="mt-6">
          <h1 className="text-2xl font-bold">{post?.title}</h1>
          <p className="text-granite-50 text-sm">
            ประกาศเมื่อ {formatDateThai(post?.startDate || '')} |{' '}
            <span className="text-main-green">{post?.category?.name}</span>
          </p>
        </header>

        <section className="mt-6">
          <div className="relative">
            <p className="text-lg line-clamp-3">{post?.description}</p>

            <div className="bg-gradient-to-t from-white via-white/60 to-white/20 h-16 w-full absolute bottom-0"></div>
          </div>

          <div className="px-2 pb-7 pt-5">
            <EditOpeningJobDrawer post={post} />
          </div>
        </section>

        <section className="py-6 border-y-2 border-colud">
          <div className="grid grid-rows-2 grid-cols-2 text-center">
            <h6 className="text-sm">จำนวนที่รับแล้ว</h6>
            <h6 className="text-sm">จำนวนผู้สมัคร</h6>
            <p className="font-bold text-lg mt-1">
              {
                post?.applicants?.submissions?.filter(
                  (post) => post?.status === 'ACCEPTED'
                )?.length
              }
              /{post?.applicants?.number || '??'} ตำแหน่ง
            </p>
            <p className="font-bold text-lg mt-1">
              {post?.applicants?.submissions?.length} คน
            </p>
          </div>
        </section>

        <section className="">
          <CandidateAccordionSection post={post} />
        </section>
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function JobOpeningCard({ post }: Props) {
  return (
    <div className="border rounded-lg border-mist px-4 py-6 text-left bg-white">
      <h1 className="font-bold text-lg truncate">{post?.title}</h1>

      <div className="mt-4 flex justify-between">
        <div>
          <span className="text-main-green">{post?.category?.name}</span>
          <span className="ml-2 text-granite-50">
            {formatCardDate(new Date(post?.createdAt))}
          </span>
        </div>

        <BadgeStatus acceptanceStatus={post?.acceptanceStatus} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

function CandidateAccordionSection({ post }: Props) {
  // ----------------------------------------------------------------------

  const CustomAccordion = styled(Accordion)(({ theme }) => {
    return {
      boxShadow: 'none',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      ':before': {
        height: '2px !important',
        backgroundColor: '#EFF0F4',
        opacity: '1 !important',
      },
      '.MuiAccordionDetails-root': {},
      '.MuiAccordionSummary-root': {},
    };
  });

  const ExpandMoreIcon = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/icons/accordion/Expand.svg"
      alt="Expand Icon"
      width={15}
      height={18}
    />
  );

  // ----------------------------------------------------------------------

  const submissions = post?.applicants?.submissions;

  const pendingSubmissions = submissions?.filter(
    (post) => post.status === 'PENDING'
  );

  const approvedSubmissions = submissions?.filter(
    (post) => post.status === 'ACCEPTED'
  );

  const rejectedSubmissions = submissions?.filter(
    (post) => post.status === 'REJECTED'
  );

  // ----------------------------------------------------------------------

  return (
    <div>
      <CustomAccordion>
        <AccordionSummary
          expandIcon={ExpandMoreIcon}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h1 className="font-bold text-lg">
            ยังไม่พิจารณา ({pendingSubmissions.length})
          </h1>
        </AccordionSummary>
        <AccordionDetails>
          {pendingSubmissions.length === 0 && (
            <NoData label="ยังไม่มีผู้สมัคร" />
          )}
          <div className="space-y-3">
            {pendingSubmissions.map((submission) => (
              <PendingCandidateDrawer
                key={submission._id}
                post={post}
                submission={submission}
              />
            ))}
          </div>
        </AccordionDetails>
      </CustomAccordion>
      <CustomAccordion>
        <AccordionSummary
          expandIcon={ExpandMoreIcon}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h1 className="font-bold text-lg">
            พิจารณาแล้ว (
            {approvedSubmissions.length + rejectedSubmissions.length})
          </h1>
        </AccordionSummary>
        <AccordionDetails>
          {!approvedSubmissions.length && !rejectedSubmissions.length && (
            <NoData label="ยังไม่มีผู้สมัคร" />
          )}
          {approvedSubmissions.length ? (
            <div className="px-4 py-6 border border-mist rounded-lg mb-4">
              <h1 className="text-lg font-semibold mb-4">
                <span className="text-main-green">รับแล้ว</span> (
                {approvedSubmissions.length})
              </h1>
              <div className="space-y-3 ">
                {approvedSubmissions.map((submission) => (
                  <CandidateAcceptedDrawer
                    key={submission._id}
                    post={post}
                    submission={submission}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {rejectedSubmissions.length ? (
            <div className="px-4 py-6 border border-mist rounded-lg">
              <h1 className="text-lg font-semibold mb-4">
                <span className="text-main-red">ไม่สนใจ</span> (
                {rejectedSubmissions.length})
              </h1>
              <div className="space-y-3">
                {rejectedSubmissions.map((submission) => (
                  <CandidateAcceptedDrawer
                    key={submission._id}
                    post={post}
                    submission={submission}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </AccordionDetails>
      </CustomAccordion>
    </div>
  );
}

// ----------------------------------------------------------------------

function PendingCandidateDrawer({
  post,
  submission,
}: Props & { submission: SubmissionType }) {
  const { enqueueSnackbar } = useSnackbar();

  // ----------------------------------------------------------------------

  const userPosts = useUserStore((state) => state.userPosts);
  const setUserPosts = useUserStore((state) => state.setUserPosts);

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const handleReject = async () => {
    try {
      const { data } = await axios.post(
        `/job-posts/${post._id}/submissions/${submission.candidate?._id}/reject`
      );

      const updatedUserPosts = userPosts.map((userPost) =>
        userPost._id === post._id
          ? {
              ...userPost,
              acceptanceStatus: data.acceptanceStatus,
              applicants: {
                ...userPost.applicants,
                submissions: data.submissions,
              },
            }
          : userPost
      );

      setUserPosts(updatedUserPosts);

      setOpen(false);
    } catch (error) {
      enqueueSnackbar('ไม่สามารถปฎิเสธได้ โปรดลองอีกทีในภายหลัง', {
        variant: 'error',
      });
      console.log({ error });
    }
  };

  // ----------------------------------------------------------------------

  return (
    <div className="flex-1 flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={submission?.candidate?.profileImageUrl}
        alt=" user image"
        className="w-8 h-8 rounded-full border-2 border-main-orange"
      />

      <p className="flex-1 font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {submission?.candidate?.name || 'ชื่อผู้ใช้งาน'}
      </p>

      <p className="ml-1 mr-2 text-sm font-light whitespace-nowrap">สมัครงาน</p>

      <button
        className="text-xs rounded-xl border border-main-orange px-2 py-1 text-main-orange font-semibold whitespace-nowrap"
        onClick={toggleDrawer(true)}
      >
        ดูโปรไฟล์
      </button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 10rem',
          },
        }}
      >
        <BackDrawerButton label="กลับ" toggleDrawer={toggleDrawer} />

        <header className="mt-6">
          <h1 className="text-2xl font-bold">{post?.title}</h1>
        </header>

        {/* BackDrop Icon */}
        <Image
          src="/assets/illustrations/Forms.svg"
          alt="backdrop icon"
          width={120}
          height={120}
          className="absolute top-1.5 right-1.5 -z-10"
        />

        <InformationBox title="ข้อมูลส่วนตัวผู้สมัคร">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={submission?.candidate?.profileImageUrl}
            alt="user"
            className="w-16 h-16 rounded-full border border-main-green"
          />
          <InformationLabel
            title="ชื่อ-สกุล"
            desc={submission?.candidate?.name || 'ไม่ทราบ'}
          />
          <InformationLabel
            title="เกิดวันที่"
            desc={
              submission?.candidate?.birthDate
                ? formatDateThai(submission?.candidate?.birthDate)
                : 'ไม่ทราบ'
            }
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(submission?.candidate?.phoneNumber)}
          />
          <InformationLabel
            title="เคยประกอบอาชีพ"
            desc={submission?.candidate?.experiences || 'ไม่ทราบ'}
          />
        </InformationBox>

        <section className="flex gap-7 my-4">
          <a
            href={`tel:${submission?.candidate?.phoneNumber}`}
            className="w-full"
          >
            <IconButton
              image="/assets/icons/home/Call.svg"
              label="ติดต่อ"
              callback={() => {}}
            />
          </a>

          <IconButton
            image="/assets/icons/home/Close.svg"
            label="ไม่สนใจ"
            callback={handleReject}
          />
        </section>

        <InformationBox title="เพิ่มเติม">
          <InformationLabel
            title="ข้อความเพิ่มเติม"
            desc={submission?.additionalInformation || 'ไม่มีข้อความเพิ่มเติม'}
          />
        </InformationBox>

        <InformationBox title="ต้องการสมัครงาน">
          <InformationLabel title="ชื่องาน" desc={post?.title} />
          <InformationLabel title="คุณสมบัติ" desc={post?.qualification} />
          <InformationLabel
            title="ค่าตอบแทน"
            desc={`${post?.wage.amount} ${post?.wage?.unit}`}
          />
          <InformationLabel
            title="ผู้ว่าจ้าง"
            desc={post?.createdBy?.name || 'ไม่ทราบ'}
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(post?.createdBy?.phoneNumber)}
          />
        </InformationBox>

        <AcceptCandidateSuccessDrawer
          post={post}
          submissionId={submission?.candidate?._id || ''}
        />
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function CandidateAcceptedDrawer({
  post,
  submission,
}: Props & { submission: SubmissionType }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  return (
    <div className="flex-1 flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={submission?.candidate?.profileImageUrl}
        alt=" user image"
        className="w-8 h-8 rounded-full border-2 border-main-orange"
      />

      <p className="flex-1 font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
        {submission?.candidate?.name || 'ชื่อผู้ใช้งาน'}
      </p>

      <p className="ml-1 mr-2 text-sm font-light whitespace-nowrap">สมัครงาน</p>

      <button
        className="text-xs rounded-xl border border-main-orange px-2 py-1 text-main-orange font-semibold whitespace-nowrap"
        onClick={toggleDrawer(true)}
      >
        ดูโปรไฟล์
      </button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 5rem',
          },
        }}
      >
        <BackDrawerButton label="กลับ" toggleDrawer={toggleDrawer} />

        <header className="mt-6">
          <h1 className="text-2xl font-bold">{post?.title}</h1>
        </header>

        {/* BackDrop Icon */}
        <Image
          src="/assets/illustrations/Forms.svg"
          alt="backdrop icon"
          width={120}
          height={120}
          className="absolute top-1.5 right-1.5 -z-10"
        />

        <InformationBox title="ข้อมูลส่วนตัวผู้สมัคร">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={submission?.candidate?.profileImageUrl}
            alt="user"
            className="w-16 h-16 rounded-full border border-main-green"
          />
          <InformationLabel
            title="ชื่อ-สกุล"
            desc={submission?.candidate?.name || 'ไม่ทราบ'}
          />
          <InformationLabel
            title="เกิดวันที่"
            desc={
              submission?.candidate?.birthDate
                ? formatDateThai(submission?.candidate?.birthDate)
                : 'ไม่ทราบ'
            }
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(submission?.candidate?.phoneNumber)}
          />
          <InformationLabel
            title="เคยประกอบอาชีพ"
            desc={submission?.candidate?.experiences || 'ไม่ทราบ'}
          />
        </InformationBox>

        <section className="flex gap-7 my-4">
          <a
            href={`tel:${submission?.candidate?.phoneNumber}`}
            className="w-full"
          >
            <IconButton
              image="/assets/icons/home/Call.svg"
              label="ติดต่อ"
              callback={() => {}}
            />
          </a>
        </section>

        <InformationBox title="เพิ่มเติม">
          <InformationLabel
            title="ข้อความเพิ่มเติม"
            desc={submission?.additionalInformation || 'ไม่มีข้อความเพิ่มเติม'}
          />
        </InformationBox>

        <InformationBox title="ต้องการสมัครงาน">
          <InformationLabel title="ชื่องาน" desc={post?.title} />
          <InformationLabel title="คุณสมบัติ" desc={post?.qualification} />
          <InformationLabel
            title="ค่าตอบแทน"
            desc={`${post?.wage.amount} ${post?.wage?.unit}`}
          />
          <InformationLabel
            title="ผู้ว่าจ้าง"
            desc={post?.createdBy?.name || 'ไม่ทราบ'}
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(post?.createdBy?.phoneNumber)}
          />
        </InformationBox>
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function AcceptCandidateSuccessDrawer({
  post,
  submissionId,
}: Props & { submissionId: string }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // ----------------------------------------------------------------------

  const userPosts = useUserStore((state) => state.userPosts);
  const setUserPosts = useUserStore((state) => state.setUserPosts);

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const handleAcceptCandidate = async () => {
    try {
      const { data } = await axios.post(
        `/job-posts/${post._id}/submissions/${submissionId}/accept`
      );

      const updatedUserPosts = userPosts.map((userPost) =>
        userPost._id === post._id
          ? {
              ...userPost,
              acceptanceStatus: data.acceptanceStatus,
              applicants: {
                ...userPost.applicants,
                submissions: data.submissions,
              },
            }
          : userPost
      );

      setUserPosts(updatedUserPosts);
      setOpen(true);
    } catch (error) {
      console.log(error);
      enqueueSnackbar('เกิดข้อผิดพลาด', { variant: 'error' });
    }
  };

  // ----------------------------------------------------------------------

  return (
    <>
      <section className="fixed bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
        <button
          className="btn btn-solid w-full font-bold"
          onClick={handleAcceptCandidate}
        >
          ยืนยันรับเข้าทำงาน
        </button>
      </section>

      <Drawer
        transitionDuration={0}
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 10rem',
          },
        }}
      >
        <section className="flex flex-col justify-center items-center mt-20">
          <Image
            src="/assets/illustrations/DirectingPending.svg"
            alt="Job registered"
            width={260}
            height={260}
            className="max-w-full relative right-2"
          />

          <p className="text-center font-bold text-lg mt-16">
            เราส่งใบสมัครของคุณแล้ว! <br /> โปรดรอการติดต่อกลับ
          </p>
        </section>

        <section className="fixed bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
          <button
            className="btn btn-solid w-full font-bold"
            onClick={() => router.reload()}
          >
            กลับไปหน้าหลัก
          </button>
        </section>
      </Drawer>
    </>
  );
}
