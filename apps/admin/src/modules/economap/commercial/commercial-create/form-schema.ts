import { z } from 'zod';

// ----------------------------------------------------------------------
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

// ----------------------------------------------------------------------

const latlngSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  .refine(
    (data) => {
      const { latitude, longitude } = data;

      return latitude !== 0 && longitude !== 0;
    },
    {
      message: 'กรุณาเลือกตำแหน่ง',
    }
  );

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const dateSchema = z
  .object({
    day: z.preprocess(
      (val) => (Array.isArray(val) ? val : []),
      z.array(z.string()).refine((arr) => arr.length > 0, {
        message: 'กรุณาเลือกวันทำการ',
      })
    ),
    openTime: z.string().min(1, { message: 'เช่น 09:00' }),
    closeTime: z.string().min(1, { message: 'เช่น 18:00' }),
  })
  .refine(
    ({ openTime, closeTime }) => {
      const openMinutes = timeToMinutes(openTime);
      const closeMinutes = timeToMinutes(closeTime);
      return openMinutes < closeMinutes;
    },
    {
      message: 'เวลาเปิดต้องก่อนเวลาปิด',
      path: ['closeTime'],
    }
  );

export const formSchema = z.object({
  name: z.string().min(1, `กรุณากรอกชื่อ`).max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  types: z.array(z.string()).min(1, 'กรุณาเลือกประเภท').max(3, 'เลือกได้มากสุด 3 ประเภท'),
  commercialOwner: z
    .string()
    .min(1, 'กรุณากรอกชื่อเจ้าของ')
    .max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  phoneNumber: z.string().regex(/^\d{9,10}$/, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),
  province: z
    .string()
    .nullable()
    .refine((value) => value !== null && value !== '', {
      message: 'กรุณาเลือกจังหวัด',
    }),
  district: z
    .string()
    .nullable()
    .refine((value) => value !== null && value !== '', {
      message: 'กรุณาเลือกเขต/อำเภอ',
    }),
  moreInfo: z.string().max(250, 'ความยาวไม่เกิน 250 ตัวอักษร'),
  opening: z.array(dateSchema),
  location: latlngSchema,
  thumbnail: z
    .array(z.instanceof(File))
    .min(1, 'กรุณาเลือกรูปภาพ')
    .max(1, 'เลือกรูปภาพได้มากสุด 1 รูป')
    .refine((files) => files.every((file) => ALLOWED_FILE_TYPES.includes(file.type)), {
      message: 'กรุณาเลือกรูปภาพที่มีนามสกุล jpg, jpeg, หรือ png',
    })
    .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
      message: 'กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 3MB',
    }),
  images: z
    .array(z.instanceof(File))
    .max(20, 'เลือกรูปภาพได้มากสุด 20 รูป')
    .refine((files) => files.every((file) => ALLOWED_FILE_TYPES.includes(file.type)), {
      message: 'กรุณาเลือกรูปภาพที่มีนามสกุล jpg, jpeg, หรือ png',
    })
    .refine((files) => files.every((file) => file.size <= MAX_IMAGE_SIZE), {
      message: 'กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 3MB',
    }),
});

export type FormSchema = z.infer<typeof formSchema>;

export type DateSchema = z.infer<typeof dateSchema>;
