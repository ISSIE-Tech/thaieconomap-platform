import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';

import { useForm, Resolver } from 'react-hook-form';

import {
  FromProvider,
  RHFAutocomplete,
  RHFBulletTextArea,
  RHFTextField,
} from './hook-form';
import RHFDatePicker from './hook-form/RHFDatePicker';
import { BackDrawerButton } from './button';
import { InformationBox, InformationLabel } from './information-box';
import LeafletMap, { MapCenter } from './leaflet-map';
import { SwiperDrawer } from './drawer';
import EditProfileDrawer from './EditProfileDrawer';

import { PostType } from '@/types/post';
import { formatDateThai } from '@/utils/form';
import { usePostStore, useUserStore } from '@/store';
import axios from '@/utils/axios';

import * as yup from 'yup';
import { Drawer } from '@mui/material';
import { LatLngTuple } from 'leaflet';
import { formatUpdatePostData } from '@/services/form';
import { useSnackbar } from 'notistack';
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '@/config-global';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

type UpdatePostType = PostType & { images?: File[] };

type PostContextType = {
  post: UpdatePostType;
  setPost: Dispatch<SetStateAction<UpdatePostType>>;
};

const PostContext = createContext({} as PostContextType);

// ----------------------------------------------------------------------

type Props = {
  post: PostType;
  setPost?: Dispatch<SetStateAction<PostType>>;
  toggleButton?: React.ReactNode;
};

export default function EditOpeningJobDrawer({
  post: defaultPost,
  toggleButton,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const userPosts = useUserStore((state) => state.userPosts);
  const setUserPosts = useUserStore((state) => state.setUserPosts);

  // ----------------------------------------------------------------------

  const [post, setPost] = useState<UpdatePostType>(defaultPost);

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const handleCancel = (state: boolean) => () => {
    setPost(defaultPost);
    setOpen(state);
  };

  const handleSave = async () => {
    const formatData = formatUpdatePostData({ ...post });

    try {
      const res = await axios.patch(`/job-posts/${post._id}`, formatData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { jobPost } = res.data;
      setUserPosts([
        ...userPosts.map((post) => (post._id === jobPost._id ? jobPost : post)),
      ]);
      setOpen(false);
    } catch (error) {
      console.log({ error });
      enqueueSnackbar('เกิดข้อผิดพลาด', { variant: 'error' });
    }
  };

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!open) return;

    const bolbImages: File[] = [];

    const fetchBlob = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const name = url.split('/').pop()?.split('.')[0] || 'image.jpg';
      const file = new File([blob], name, { type: 'image/jpeg' });
      return file;
    };

    const getFiles = async () => {
      const promises = post.imageUrls.map(fetchBlob);
      const files = await Promise.all(promises);
      bolbImages.push(...files);
      setPost((prev) => ({ ...prev, images: bolbImages }));
    };

    getFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ----------------------------------------------------------------------

  return (
    <PostContext.Provider value={{ post, setPost }}>
      {toggleButton ? (
        <button className="w-full" onClick={toggleDrawer(true)}>
          {toggleButton}
        </button>
      ) : (
        <button
          className="bg-cloud py-2 w-full rounded-lg text-main-green font-bold"
          onClick={toggleDrawer(true)}
        >
          ดูรายละเอียดและแก้ไข
        </button>
      )}

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
            padding: '1rem 1.5rem 0',
          },
        }}
      >
        <BackDrawerButton label="กลับ" toggleDrawer={handleCancel} />

        <section>
          <h1 className="text-2xl font-semibold mt-8">แก้ไขประกาศงาน</h1>
        </section>

        <Image
          src="/assets/illustrations/Forms.svg"
          alt="backdrop icon"
          width={120}
          height={120}
          className="absolute top-4 right-1.5 -z-10"
        />

        <InformationBox title="ข้อมูลเบื้องต้น">
          <InformationLabel title="ชื่องาน" desc={post?.title} />
          <InformationLabel title="รายละเอียดคร่าวๆ" desc={post?.description} />
          <InformationLabel title="ประเภทงาน" desc={post?.category?.name} />

          <EditBasicInformation />
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

          <EditDetailedInformation />
        </InformationBox>

        <InformationBox title="สถานที่ทำงาน">
          <InformationLabel
            title="ชื่อาถานที่ทำงาน"
            desc={post?.location?.address?.name || ''}
          />

          <p className="text-sm text-granite-50">ตำแหน่งสถานที่ทำงานในแผนที่</p>
          <div className="h-[200px] rounded-xl">
            <LeafletMap
              marker={post?.title}
              latitude={post?.location?.latitude}
              longitude={post?.location?.longitude}
              borderRadius="1rem"
            />
          </div>

          <EditWorkplace />
        </InformationBox>

        <EditImages />

        <EditProfileDrawer />

        <section className="bg-white px-6 pt-4 pb-8 mt-5 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg w-screen relative right-[1.5rem]">
          <button
            className="btn btn-solid w-full font-bold text-lg"
            onClick={handleSave}
          >
            บันทึกทั้งหมด
          </button>
        </section>
      </Drawer>
    </PostContext.Provider>
  );
}

// ----------------------------------------------------------------------

function EditBasicInformation() {
  const { post, setPost } = useContext(PostContext);
  const categories = usePostStore((state) => state.categories);

  // ----------------------------------------------------------------------

  const defaultValues = {
    title: post?.title || '',
    description: post?.description || '',
    category: post?.category?.name || '',
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required('ยังไม่ได้กรอกชื่องาน'),
    description: yup.string().required('ยังไม่ได้กรอกรายละเอียดงาน'),
    category: yup
      .string()
      .typeError('ยังไม่ได้เลือกประเภทงาน')
      .required('ยังไม่ได้เลือกประเภทงาน'),
  });

  // text inputs submit strings and yup casts them (number/date); keep the form's
  // value type as the defaults so nothing about the submitted payload changes
  const methods = useForm<typeof defaultValues>({
    defaultValues,
    resolver: yupResolver(validationSchema) as unknown as Resolver<typeof defaultValues>,
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const handleCancel = () => {
    reset(defaultValues);
  };

  const handleSave = async (data: typeof defaultValues) => {
    const { title, description, category } = data;
    setPost((prev) => ({
      ...prev,
      title,
      description,
      category: { ...prev.category, name: category },
    }));
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <SwiperDrawer
        label="แก้ไขข้อมูล"
        onCancel={handleCancel}
        onSave={handleSubmit(handleSave)}
        isValid={isValid}
      >
        <header>
          <h1 className="font-bold text-lg">ข้อมูลเบื้องต้น</h1>
        </header>

        <FromProvider methods={methods}>
          <div className="mt-6 space-y-4">
            <RHFTextField name="title" label="ชื่องาน" />
            <RHFTextField
              name="description"
              placeholder="กรอกรายละเอียด เช่น งานประจำ ตำแหน่ง วันทำงาน"
              multiline
              rows={4}
            />
            <RHFAutocomplete
              name="category"
              label="ประเภทงาน"
              options={categories.map((c) => c.name)}
            />
          </div>
        </FromProvider>
      </SwiperDrawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function EditDetailedInformation() {
  const { post, setPost } = useContext(PostContext);
  const wageUnits = usePostStore((state) => state.wageUnits);

  // ----------------------------------------------------------------------

  const defaultValues = {
    qualification: post?.qualification || '- ',
    workload: post?.workload || '- ',
    applicants: post?.applicants.number || '',
    wageAmount: post?.wage?.amount || '',
    wageUnit: post?.wage?.unit || '',
    startDate: post?.startDate || '',
    endDate: post?.endDate || '',
    closeDate: post?.closeDate || '',
  };

  const validationSchema = yup.object().shape({
    qualification: yup
      .string()
      .trim()
      .notOneOf(['-'], 'ยังไม่ได้กรอกภาระงาน')
      .required('ยังไม่ได้กรอกภาระงาน'),
    workload: yup
      .string()
      .trim()
      .notOneOf(['-'], 'ยังไม่ได้กรอกคุณสมบัติ')
      .required('ยังไม่ได้กรอกคุณสมบัติ'),
    applicants: yup
      .number()
      .min(1, 'ต้องมีตำแหน่งอย่างน้อย 1 ตำแหน่ง')
      .typeError('กรอกเฉพาะตัวเลยเท่านั้น')
      .required('ยังไม่ได้กรอกจำนวนตำแหน่ง'),
    startDate: yup
      .string()
      .typeError('ยังไม่ได้เลือกวันเริ่มงาน')
      .required('ยังไม่ได้เลือกวันเริ่มงาน'),
    endDate: yup
      .string()
      .typeError('ยังไม่ได้เลือกวันสิ้นสุดงาน')
      .required('ยังไม่ได้เลือกวันสิ้นสุดงาน'),
    closeDate: yup
      .string()
      .typeError('ยังไม่ได้เลือกวันปิดประกาศ')
      .required('ยังไม่ได้เลือกวันปิดประกาศ'),
    wageAmount: yup
      .number()
      .min(0, 'ยังไม่ได้กรอกค่าตอบแทน')
      .typeError('ยังไม่ได้กรอกค่าตอบแทน')
      .required('ยังไม่ได้กรอกค่าตอบแทน'),
    wageUnit: yup
      .string()
      .typeError('ยังไม่ได้เลือกหน่วย')
      .required('ยังไม่ได้เลือกหน่วย'),
  });

  // text inputs submit strings and yup casts them (number/date); keep the form's
  // value type as the defaults so nothing about the submitted payload changes
  const methods = useForm<typeof defaultValues>({
    defaultValues,
    resolver: yupResolver(validationSchema) as unknown as Resolver<typeof defaultValues>,
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const handleCancel = () => {
    reset(defaultValues);
  };

  const handleSave = async (data: typeof defaultValues) => {
    const {
      qualification,
      workload,
      applicants,
      wageAmount,
      wageUnit,
      startDate,
      endDate,
      closeDate,
    } = data;

    setPost((prev) => ({
      ...prev,
      qualification,
      workload,
      applicants: { ...prev.applicants, number: applicants },
      wage: {
        ...prev.wage,
        amount: wageAmount,
        unit: wageUnit,
      },
      startDate,
      endDate,
      closeDate,
    }));
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <SwiperDrawer
        label="แก้ไขข้อมูล"
        onCancel={handleCancel}
        onSave={handleSubmit(handleSave)}
        isValid={isValid}
      >
        <header>
          <h1 className="font-bold text-lg">ข้อมูลโดยละเอียด</h1>
        </header>

        <FromProvider methods={methods}>
          <div className="mt-6 space-y-4">
            <RHFBulletTextArea
              name="workload"
              label="ภาระงานโดยละเอียด"
              placeholder="ภาระงานที่ต้องทราบ"
            />
            <RHFBulletTextArea
              name="qualification"
              label="คุณสมบัติที่ต้องการ"
              placeholder="กรอกรายละเอียดเช่น วุฒิการศึกษา ความสามารถ"
            />
            <RHFTextField name="applicants" label="จำนวนตำแหน่งที่เปิดรับ" />
            <div className="flex gap-3">
              <RHFTextField name="wageAmount" label="ค่าตอบแทนทั้งหมด (บาท)" />
              <RHFAutocomplete
                name="wageUnit"
                label="หน่วย"
                options={wageUnits.map((unit) => 'บาท' + unit.name)}
                fullWidth
              />
            </div>
            <div className="flex gap-3">
              <RHFDatePicker name="startDate" label="เริ่มงาน" />
              <RHFDatePicker name="endDate" label="สิ้นสุดงาน" />
            </div>
            <RHFDatePicker name="closeDate" label="วันที่ปิดรับสมัคร" />
          </div>
        </FromProvider>
      </SwiperDrawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function EditWorkplace() {
  const { post, setPost } = useContext(PostContext);

  // ----------------------------------------------------------------------

  const defaultValues = {
    address: post?.location?.address?.name || '',
  };

  const validationSchema = yup.object().shape({
    address: yup.string().required('ยังไม่ได้ดรอกชื่ออาคาร'),
  });

  // text inputs submit strings and yup casts them (number/date); keep the form's
  // value type as the defaults so nothing about the submitted payload changes
  const methods = useForm<typeof defaultValues>({
    defaultValues,
    resolver: yupResolver(validationSchema) as unknown as Resolver<typeof defaultValues>,
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  const handleCancel = () => {
    reset(defaultValues);
  };

  const handleSave = async (data: typeof defaultValues) => {
    const { address } = data;
    setPost((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        address: { ...prev.location.address, name: address },
      },
    }));
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      <SwiperDrawer
        label="แก้ไขข้อมูล"
        onCancel={handleCancel}
        onSave={handleSubmit(handleSave)}
        isValid={isValid}
      >
        <header>
          <h1 className="font-bold text-lg">สถานที่ทำงาน</h1>
        </header>

        <div className="mt-6 space-y-4">
          <FromProvider methods={methods}>
            <RHFTextField name="address" label="ชื่ออาคาร หรือ สถานที่ทำงาน" />
          </FromProvider>

          <div className="h-[220px] px-6">
            <LeafletMap
              marker={post?.title}
              latitude={post?.location?.latitude}
              longitude={post?.location?.longitude}
              borderRadius="1rem"
            />
          </div>

          <EditLocation />
        </div>
      </SwiperDrawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function EditLocation() {
  const { post, setPost } = useContext(PostContext);
  const [location, setLocation] = useState<LatLngTuple | null>([
    parseFloat(post?.location?.latitude) || DEFAULT_LATITUDE,
    parseFloat(post?.location?.longitude) || DEFAULT_LONGITUDE,
  ]);

  // ----------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  // ----------------------------------------------------------------------

  const [center, setCenter] = useState<LatLngTuple | null>(null);

  const LocationPicker = (
    <LeafletMap
      latitude={location ? `${location[0]}` : `${DEFAULT_LATITUDE}`}
      longitude={location ? `${location[1]}` : `${DEFAULT_LONGITUDE}`}
      zoom={18}
    >
      <MapCenter setCenter={setCenter} />
    </LeafletMap>
  );

  const handleSelect = () => {
    setOpen(false);
    setLocation(center || [DEFAULT_LATITUDE, DEFAULT_LONGITUDE]);
    setPost((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: `${center ? center[0] : DEFAULT_LATITUDE}`,
        longitude: `${center ? center[1] : DEFAULT_LONGITUDE}`,
      },
    }));
  };

  // ----------------------------------------------------------------------

  return (
    <div>
      {/* Toggle Button */}
      <button
        className="py-2 mt-4 text-main-green bg-cloud rounded-lg font-bold flex justify-center items-center gap-2.5 w-full"
        onClick={toggleDrawer(true)}
      >
        <span>แก้ไขตำแหน่งในแผนที่</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/icons/form/EditPencil.svg"
          alt="edit"
          width={15}
          height={15}
        />
      </button>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100vw',
            overflowX: 'hidden',
          },
        }}
      >
        <div className="absolute top-5 left-5 z-[1000]">
          <BackDrawerButton toggleDrawer={toggleDrawer} label={''} />
        </div>

        <div className="flex flex-col h-screen">
          <section className="grow relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-4 -translate-y-1/2 z-[10000] flex items-center gap-2">
              <Image
                src="/assets/icons/map/Marker.svg"
                alt="marker"
                width={32}
                height={32}
              />
              <span className="text-main-orange font-bold text-lg ">
                ที่ทำงาน
              </span>
            </div>

            {LocationPicker}
          </section>

          <section className="bg-white px-6 pt-4 pb-8 shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] rounded-t-lg">
            <button className="btn btn-solid w-full" onClick={handleSelect}>
              ยืนยันสถานที่ทำงาน
            </button>
          </section>
        </div>
      </Drawer>
    </div>
  );
}

// ----------------------------------------------------------------------

function EditImages() {
  const { enqueueSnackbar } = useSnackbar();
  const { post, setPost } = useContext(PostContext);

  // ----------------------------------------------------------------------

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const images = post?.images || [];

    if (images.length >= 6 || images.length + files.length > 6) {
      enqueueSnackbar('อัพโหลดได้สูงสุด 6 รูปภาพ', { variant: 'error' });
      return;
    }

    if (files.length > 6) {
      enqueueSnackbar('อัพโหลดได้สูงสุด 6 รูปภาพ', { variant: 'error' });
      return;
    }

    if (
      Array.from(files).some((file) =>
        images.some(
          (image) =>
            file.name === image.name &&
            file.type === image.type &&
            file.size === image.size
        )
      )
    ) {
      enqueueSnackbar('รูปภาพซ้ำกัน', { variant: 'error' });
      return;
    }

    setPost((prev) => ({ ...prev, images: [...images, ...(files as any)] }));
  };

  const handleDeleteImage = (image: File) => () => {
    setPost((prev) => ({
      ...prev,
      images: prev.images?.filter((img) => img !== image),
    }));
  };

  // ----------------------------------------------------------------------

  return (
    <InformationBox title="รูปภาพที่เกี่ยวข้อง">
      <div className="flex gap-2 items-center flex-wrap">
        {post?.images?.map((image, index) => (
          <div key={image.name + image.size} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(image)}
              alt={`uploaded image ${index}`}
              className="w-20 h-20 object-cover object-top"
            />
            <button
              className="absolute top-0 right-0 bg-white rounded-full w-6 h-6 text-main-orange"
              onClick={handleDeleteImage(image)}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <label htmlFor="image-update-input">
        <div className="py-2 mt-4 text-main-green bg-cloud rounded-lg font-bold flex justify-center items-center gap-2.5 w-full">
          <span>เพิ่มรูปภาพ</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/icons/form/EditPencil.svg"
            alt="edit"
            width={15}
            height={15}
          />
        </div>
      </label>
      <input
        id="image-update-input"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
    </InformationBox>
  );
}
