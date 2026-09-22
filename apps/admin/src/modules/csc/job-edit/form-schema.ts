import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่องาน'),
  category: z.string().min(1, 'กรุณาเลือกประเภทงาน'),
  description: z.string().min(1, 'กรุณากรอกรายละเอียดงาน'),
  workload: z.string().min(1, 'กรุณากรอกภาระงาน'),
  qualification: z.string().min(1, 'กรุณากรอกคุณสมบัติ'),
  applicants: z.coerce.number().min(1, 'ต้องมีอย่างน้อย 1 ตำแหน่ง'),
  wageAmount: z.coerce.number().min(0, 'กรุณากรอกค่าตอบแทน'),
  wageUnit: z.string().min(1, 'กรุณาเลือกหน่วยค่าตอบแทน'),
  startDate: z.coerce.date({ message: 'กรุณาเลือกวันเริ่มงาน' }),
  endDate: z.coerce.date({ message: 'กรุณาเลือกวันสิ้นสุดงาน' }),
  closeDate: z.coerce.date().optional().nullable(),
  // existing images come back as their (presigned) url, new ones as File
  images: z.array(z.union([z.string(), z.instanceof(File)])).default([]),
});

export type FormSchema = z.infer<typeof formSchema>;
