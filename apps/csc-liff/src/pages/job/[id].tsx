import { useAuth } from "@/auth/useAuth";
import { RegisterJobSuccessDrawer } from "@/components/JobPostDrawer";
import { BackDrawerButton } from "@/components/button";
import { InformationBox, InformationLabel } from "@/components/information-box";
import { ErrorScreen } from "@/components/loading";
import { usePostStore } from "@/store";
import { PostType } from "@/types/post";
import axios from "@/utils/axios";
import { formatDateThai, formatPhoneNumber } from "@/utils/form";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  post: PostType;
};

export default function Job() {
  const router = useRouter();
  const setPosts = usePostStore((state) => state.setPosts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse] = await Promise.all([
          axios.get("/job-posts?perPage=9999"),
        ]);

        const jobPosts: PostType[] = jobsResponse.data.jobPosts.data;

        setPosts(jobPosts);
      } catch (e) {
        return <ErrorScreen />;
      }
    };
    fetchData();
  }, [setPosts]);

  const posts = usePostStore((state) => state.posts);

  const post: PostType = posts.find(
    (post) => post._id === router.query.id
  ) as PostType;

  return post ? <RegisterJobDrawer post={post} /> : <NoData />;
}

function NoData() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <Image
        src="/assets/illustrations/Net.svg"
        alt="Search Not Found"
        width={300}
        height={300}
        className="relative left-6"
      />

      <h1 className="font-semibold text-lg text-center">
        ไม่พบข้อมูล <br />
      </h1>
    </div>
  );
}

function RegisterJobDrawer({ post }: Props) {
  const toggleDrawer = (state: boolean) => () => {
    window.history.back();
  };

  // ----------------------------------------------------------------------

  const { user } = useAuth();
  const [additionalInformation, setAdditionalInformation] = useState("");

  // ----------------------------------------------------------------------

  return (
    <div style={{ padding: "1rem 1.5rem 10rem" }}>
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
        {/* eslint-disable-next-line @next/next/no-img-element*/}
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
    </div>
  );
}
