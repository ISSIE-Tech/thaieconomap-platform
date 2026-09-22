/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { BackDrawerButton } from './button';
import { UserPostType } from '@/types/post';
import { formatDateThai, formatPhoneNumber } from '@/utils/form';
import { Drawer } from '@mui/material';
import { InformationBox, InformationLabel } from './information-box';
import { useAuth } from '@/auth/useAuth';
import LeafletMap from './leaflet-map';
import { formatCardDate } from '@/services/date';

type Props = {
  post: UserPostType;
};

export default function JobPendingDrawer({ post }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const { user } = useAuth();

  // ----------------------------------------------------------------------

  return (
    <>
      <button className="w-full" onClick={toggleDrawer(true)}>
        <JobPendingCard post={post} />
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
          toggleDrawer={toggleDrawer}
          label="กลับหน้าประกาศงาน"
        />

        <header className="mt-6">
          <h1 className="text-2xl font-bold">{post?.title}</h1>
          <p className="text-granite-50 text-sm">
            ประกาศเมื่อ {formatDateThai(post?.startDate || '')} |{' '}
            <span className="text-main-green">{post?.category?.name}</span>
          </p>
        </header>

        <InformationBox title="ข้อมูลเบื้องต้น">
          <InformationLabel title="ชื่องาน" desc={post?.title} />
          <InformationLabel title="รายละเอียดคร่าวๆ" desc={post?.description} />
          <InformationLabel title="ประเภทงาน" desc={post?.category?.name} />
          {/* <InformationLabel title="ประเภทสถานที่ทำงาน" desc={post?.} /> */}
        </InformationBox>

        <InformationBox title="ข้อมูลโดยละเอียด">
          <InformationLabel title="ภาระงานโดยละเอียด" desc={post?.workload} />
          <InformationLabel title="คุณสมบัติ" desc={post?.qualification} />
          <InformationLabel
            title="จำนวนที่เปิดรับ"
            desc={post?.applicants?.number + ' ตำแหน่ง'}
          />
          <InformationLabel
            title="ค่าตอบแทน"
            desc={`${post?.wage.amount} ${post?.wage?.unit}`}
          />
          <InformationLabel
            title="วันปิดรับการสมัคร"
            desc={formatDateThai(post?.closeDate) || ''}
          />
        </InformationBox>

        <InformationBox title="สถานที่ทำงาน">
          <InformationLabel
            title="ชื่อสถานที่ทำงาน"
            desc={post?.location?.address?.name}
          />
          <InformationLabel title="ตำแหน่งสถานที่ทำงานในแผนที่" desc={''} />
          <div className="h-[200px] rounded-xl">
            <LeafletMap
              marker={post?.title}
              latitude={post?.location?.latitude}
              longitude={post?.location?.longitude}
              borderRadius="1rem"
            />
          </div>
        </InformationBox>

        <InformationBox title="รูปภาพที่เกี่ยวข้อง">
          <div className="flex gap-2 items-center flex-wrap">
            {post?.imageUrls?.map((url, index) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`uploaded image ${index}`}
                  className="w-20 h-20 object-cover object-top"
                />
              </div>
            ))}
          </div>
        </InformationBox>

        <InformationBox title="ข้อมูลส่วนตัวผู้ประกาศงาน">
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
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function JobPendingCard({ post }: Props) {
  return (
    <div className="px-4 py-6 text-left bg-cloud border border-mist rounded-lg">
      <div>
        <h1 className="font-bold text-lg truncate">{post?.title}</h1>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <span className="text-main-green">{post?.category?.name}</span>
          <span className="ml-2 text-granite-50">
            {formatCardDate(new Date(post?.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
}
