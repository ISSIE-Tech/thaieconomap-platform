import { z } from 'zod';

export const formSchema = z.object({
  id: z.string().min(1, { message: 'กรุณากรอกไอดี' }),
  name: z
    .string()
    .min(1, { message: 'กรุณากรอกชื่อ - นามสกุล' })
    .max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  phone: z.string().regex(/^\d{9,10}$/, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),
  districts: z.array(z.string()),
  role: z.string().min(1, { message: 'กรุณาเลือกสิทธิผู้ใช้' }),
});

export type FormSchema = z.infer<typeof formSchema>;
