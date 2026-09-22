/* eslint-disable @next/next/no-img-element */

import { InformationBox, InformationLabel } from "./information-box";
import { formatDateThai, formatPhoneNumber } from "@/utils/form";

import { BackDrawerButton } from "./button";
import { BadgeStatus } from "./badge";
import { Drawer } from "@mui/material";
import IconButton from "./button/IconButton";
import Image from "next/image";
import LeafletMap from "./leaflet-map";
import { PostType } from "@/types/post";
import axios from "@/utils/axios";
import { formatCardDate } from "@/services/date";
import { useAuth } from "@/auth/useAuth";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";

type Props = {
  post: PostType;
};

export default function JobPostDrawer({ post }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <button onClick={toggleDrawer(true)} className="w-full mb-4">
        <JobCard post={post} />
      </button>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            overflowX: "hidden",
            padding: "1rem 1.5rem 7rem",
          },
        }}
      >
        <div className="w-screen h-48 relative -top-4 right-6">
          <span className="inline-block absolute mt-4 ml-6 z-[1000]">
            <BackDrawerButton
              label="กลับหน้าหลัก"
              toggleDrawer={toggleDrawer}
            />
          </span>

          <div className="h-48">
            <LeafletMap
              marker={post?.title}
              latitude={post?.location?.latitude}
              longitude={post?.location?.longitude}
              dragging={false}
            />
          </div>
        </div>

        <section className="mt-2">
          <div>
            <h1 className="text-2xl font-bold">{post?.title}</h1>
            <p className="text-granite-50 text-sm">
              ประกาศเมื่อ 13 ธันวาคม 2565 |{" "}
              <span className="text-main-green">{post?.category?.name}</span>
            </p>
          </div>

          <p className="text-lg mt-4 whitespace-pre-line">
            {post?.description}
          </p>
        </section>

        <section className="border-t border-line py-6 mt-4 flex gap-6">
          <JobLocationDrawer post={post} />
          <IconButton
            image="/assets/icons/home/Star.svg"
            label="บันทึก"
            callback={() => alert("ฟีเจอร์นี้ยังไม่เปิดให้บริการ")}
            disabled
          />
          <a href={`tel:${post?.createdBy?.phoneNumber}`} className="w-full">
            <IconButton
              image="/assets/icons/home/Call.svg"
              label="ติดต่อ"
              callback={() => {}}
            />
          </a>
        </section>

        <section className="border-t border-line py-6 mt-4">
          <table className="w-full">
            <thead className="text-left text-granite-50 text-sm">
              <tr>
                <th>สถานะ</th>
                <th>จำนวน</th>
                <th>ค่าตอบแทน</th>
              </tr>
            </thead>
            <tbody className="text-granite-100 font-semibold text-lg">
              <tr>
                <td className="pt-2">
                  <BadgeStatus acceptanceStatus={post?.acceptanceStatus} />
                </td>
                <td className="pt-2">{post?.applicants?.number}</td>
                <td className="pt-2">{`${post?.wage.amount} ${post?.wage?.unit}`}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="border-t border-line py-6 mt-4">
          <div>
            <h4 className="text-sm text-granite-50">ภาระงาน</h4>
            <ul className="list-disc text-lg mt-4">
              {/* <li>สอนพื้นฐานคณิตศาสตร์ชั้นประถมต้น</li>
              <li>มีความอดทนกับเด็กสูง</li>
              <li>เข้ากับนักเรียนได้ดี</li>
              <li>ตรงเวลา และ มีความรับผิดชอบต่อหน้าที่</li>
              <li>สามารถสอนได้อย่างน่าสนใจ</li> */}
              <span className="whitespace-pre-line">{post?.workload}</span>
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="text-sm text-granite-50">คุณสมบัติ</h4>
            <ul className="list-disc text-lg mt-4">
              {/* <li>ระดับปริญญาตรี หรือ เทียบเท่า</li>
              <li>มีประสบการณ์ หรือ วุฒิครู</li>
              <li>สามารถสื่อสารภาษาอังกฤษได้</li> */}
              <span className="whitespace-pre-line">{post?.qualification}</span>
            </ul>
          </div>
        </section>

        <section>
          {post?.imageUrls?.length ? (
            <div className="flex w-full overflow-x-scroll gap-4">
              {post?.imageUrls?.map((url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`index ${index}`}
                  className="h-[120px] object-cover object-top bg-blue-300"
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="border-t border-line py-6 mt-4">
          <h4 className="text-sm text-granite-50">ประกาศโดย</h4>
          <h1 className="mt-4 font-bold text-2xl">{post?.createdBy?.name}</h1>
        </section>

        <RegisterJobDrawer post={post} />
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function JobCard({ post }: Props) {
  return (
    <div className="border rounded-lg border-mist px-4 py-6 text-left bg-white">
      <div>
        <h1 className="font-bold text-lg truncate">{post?.title}</h1>
        <p className="mt-2 line-clamp-2 min-h-[3rem]">{post?.description}</p>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <span className="text-main-green">{post?.category?.name}</span>
          <span className="ml-2 text-granite-50">
            {formatCardDate(new Date(post?.createdAt))}
          </span>
        </div>
        <div>
          <BadgeStatus acceptanceStatus={post?.acceptanceStatus} />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------

// Have to refactor layout -> map height (maybe use flex for style)

function JobLocationDrawer({ post }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  return (
    <>
      {/* Location Drawer - Toggle Button */}
      <IconButton
        image="/assets/icons/home/Gps.svg"
        label="ดูที่อยู่"
        callback={toggleDrawer(true)}
      />

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            overflowX: "hidden",
            padding: "1rem 1.5rem",
          },
        }}
      >
        <section className="w-screen h-72 relative -top-4 right-6">
          <span className="inline-block absolute mt-4 ml-6 z-[1000]">
            <BackDrawerButton
              label="กลับหน้าหลัก"
              toggleDrawer={toggleDrawer}
            />
          </span>
          {/* ------- Replace with Map -------  */}

          <LeafletMap
            marker={post?.title}
            latitude={post?.location?.latitude}
            longitude={post?.location?.longitude}
          />
          {/* ---------------------------------  */}
        </section>

        <section className="mt-2">
          <h1 className="text-2xl font-bold">อาคารสาธรธานี</h1>
          <p className="text-sm text-granite-50 mt-2">
            {post?.location?.latitude}, {post?.location?.longitude}
          </p>
        </section>

        <section className="flex gap-8 mt-5">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${post?.location.latitude},${post?.location?.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <IconButton
              image="/assets/icons/home/Sign.svg"
              label="เส้นทาง"
              callback={() => {}}
            />
          </a>
        </section>

        <section className="relative right-6 w-screen mt-7 px-6 py-4 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
          <button
            className="btn btn-solid w-full"
            onClick={toggleDrawer(false)}
          >
            กลับไปดูรายละเอียด
          </button>
        </section>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

function RegisterJobDrawer({ post }: Props) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const { user } = useAuth();
  const [additionalInformation, setAdditionalInformation] = useState("");

  // ----------------------------------------------------------------------

  const informationLabel = (label: string, value: string = "") => {
    return (
      <span className="flex flex-col gap-2">
        <p className="text-sm text-granite-50">{label}</p>
        <p className="text-sm text-granite-100 bg-paper-100 pl-1 py-0.5 whitespace-pre-line">
          {value}
        </p>
      </span>
    );
  };

  // ----------------------------------------------------------------------

  return (
    <>
      <section className="fixed bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
        <button
          className="btn btn-solid w-full font-bold text-lg"
          onClick={toggleDrawer(true)}
        >
          สมัครงานนี้
        </button>
      </section>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            overflowX: "hidden",
            padding: "1rem 1.5rem 10rem",
          },
        }}
      >
        <BackDrawerButton label="กลับ" toggleDrawer={toggleDrawer} />

        <h1 className="text-2xl font-bold mt-8">งานยืนยันข้อมูล</h1>

        {/* BackDrop Icon */}
        <Image
          src="/assets/illustrations/Forms.svg"
          alt="backdrop icon"
          width={120}
          height={120}
          className="absolute top-1.5 right-1.5 -z-10"
        />

        <InformationBox title="ข้อมูลส่วนตัวผู้สมัคร">
          <img
            src={user?.profileImageUrl}
            alt="user"
            className="w-16 h-16 rounded-full border border-main-green"
          />
          <InformationLabel title="ชื่อ-สกุล" desc={user?.name || "ไม่ทราบ"} />
          <InformationLabel
            title="เกิดวันที่"
            desc={user?.birthDate ? formatDateThai(user?.birthDate) : "ไม่ทราบ"}
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(user?.phoneNumber)}
          />
          <InformationLabel
            title="เคยประกอบอาชีพ"
            desc={user?.experiences || "ไม่ทราบ"}
          />
        </InformationBox>

        <section className="mt-4 px-4 py-6 border border-mist rounded-lg flex flex-col gap-2 bg-white">
          <h1 className="font-bold text-lg">เพิ่มเติม</h1>

          <textarea
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.currentTarget.value)}
            className="border-mist bg-paper-100 rounded-lg p-4 text-lg resize-none"
            placeholder="กรอกข้อมูลเพิ่มเติม"
            rows={4}
          />
        </section>

        <InformationBox title="ต้องการสมัครงาน">
          <InformationLabel title="ชื่องาน" desc={post?.title} />
          <InformationLabel title="คุณสมบัติ" desc={post?.qualification} />
          <InformationLabel
            title="ค่าตอบแทน"
            desc={`${post?.wage.amount} ${post?.wage?.unit}`}
          />
          <InformationLabel
            title="ผู้ว่าจ้าง"
            desc={post?.createdBy?.name || "ไม่ทราบ"}
          />
          <InformationLabel
            title="เบอร์ติดต่อ"
            desc={formatPhoneNumber(post?.createdBy?.phoneNumber)}
          />
        </InformationBox>

        <RegisterJobSuccessDrawer
          post={post}
          additionalInformation={additionalInformation}
        />
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

export function RegisterJobSuccessDrawer({
  post,
  additionalInformation,
}: Props & { additionalInformation: string }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const handleApplyJob = async () => {
    try {
      await axios.post(`/job-posts/${post._id}/apply`, {
        additionalInformation,
      });

      setOpen(true);
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาด";

      if (error.message === "user already applied") {
        errorMessage = "คุณได้สมัครงานนี้ไปแล้ว";
      }

      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // ----------------------------------------------------------------------

  return (
    <>
      <section className="fixed bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
        <button className="btn btn-solid w-full" onClick={handleApplyJob}>
          ส่งใบสมัคร
        </button>
      </section>

      <Drawer
        transitionDuration={0}
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: "100vw",
            overflowX: "hidden",
            padding: "1rem 1.5rem 10rem",
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
            onClick={() => router.push("/profile")}
          >
            กลับไปหน้าหลัก
          </button>
        </section>
      </Drawer>
    </>
  );
}
