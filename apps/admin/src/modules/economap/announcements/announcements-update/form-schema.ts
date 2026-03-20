import { z } from 'zod';

const maxSizeOfImage = 3 * 1024 * 1024;

export const formSchema = z
  .object({
    name: z.string().min(1, `กรุณากรอกชื่อ`).max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
    detail: z.string().min(1, `กรุณากรอกรายละเอียด`).max(100, 'ความยาวไม่เกิน 250 ตัวอักษร'),
    districts: z.array(z.string()).min(1, 'กรุณาเลือกเขต'),
    subDistricts: z.string(),
    pdf: z
      .array(z.instanceof(File))
      .min(1, 'กรุณาเลือกไฟล์')
      .max(1, 'เลือกไฟล์ได้มากสุด 1 ไฟล์')
      .refine((files) => files.every((file) => file.size <= maxSizeOfImage), {
        message: 'กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 3MB',
      }),
    startAt: z.string().min(1, `กรุณาเลือกวันที่ประกาศ`).max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
    endAt: z.string().min(1, `กรุณาเลือกวันสิ้นสุด`).max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
    announcer: z.string().min(1, `กรุณากรอกชื่อ`).max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
    phoneNumber: z.string().regex(/^\d{9,10}$/, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAt);
      const end = new Date(data.endAt);
      return start < end;
    },
    {
      message: 'วันที่ประกาศต้องก่อนวันที่สิ้นสุด',
      path: ['endAt'],
    }
  );

export type FormSchema = z.infer<typeof formSchema>;
