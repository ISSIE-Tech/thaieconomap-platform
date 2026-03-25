import { z } from 'zod';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

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

export const pumpuangFormSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  licensePlate: z.string().min(1, 'กรุณากรอกทะเบียนรถ').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  owner: z.string().min(1, 'กรุณากรอกชื่อเจ้าของ').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  color: z.string().min(1, 'กรุณากรอกสีรถ').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  phoneNumber: z.string().regex(/^\d{9,10}$/, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),
  moreInfo: z.string().max(250, 'ความยาวไม่เกิน 250 ตัวอักษร').optional().or(z.literal('')),
  opening: z.array(dateSchema).min(1, 'กรุณาเพิ่มวันทำการอย่างน้อย 1 รายการ'),
  types: z.array(z.string()).min(1, 'กรุณาเลือกประเภท').max(3, 'เลือกได้มากสุด 3 ประเภท'),
  thumbnail: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, 'กรุณาเลือกรูปภาพ')
    .max(1, 'เลือกรูปภาพได้มากสุด 1 รูป'),
  images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .max(20, 'เลือกรูปภาพได้มากสุด 20 รูป'),
});

export type PumpuangFormSchema = z.infer<typeof pumpuangFormSchema>;
