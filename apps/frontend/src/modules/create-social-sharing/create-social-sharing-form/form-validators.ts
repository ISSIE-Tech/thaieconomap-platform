import { z } from 'zod';

/** *************************************************
 * validate inside location
 ************************************************* */

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

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const maxSizeOfImage = 3 * 1024 * 1024;

export const formSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อสิ่งของ').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  types: z.array(z.string()).min(1, 'กรุณาเลือกประเภทสิ่งของ').max(3, 'เลือกได้มากสุด 3 ประเภท'),
  // address: z.string(),
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
      message: 'กรุณาเลือกเขต / อำเภอ',
    }),
  detail: z.string().max(200, 'ความยาวไม่เกิน 200 ตัวอักษร'),
  moreDetail: z.string().max(200, 'ความยาวไม่เกิน 200 ตัวอักษร'),
  condition: z.string().min(1, 'กรุณาเลือกสภาพสิ่งของ'),
  location: latlngSchema,

  amount: z.number().positive('กรุณาระบุจำนวน'),
  unit: z.string().min(1, 'กรุณาระบุหน่วย').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),

  ownerName: z.string().min(1, 'กรุณากรอกชื่อเจ้าของ').max(100, 'ความยาวไม่เกิน 100 ตัวอักษร'),
  phoneNumber: z.string().regex(/^\d{9,10}$/, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),

  image: z
    .array(z.instanceof(File))
    .min(1, 'กรุณาเลือกรูปภาพ')
    .max(1, 'เลือกรูปภาพได้มากสุด 1 รูป')
    .refine((files) => files.every((file) => allowedFileTypes.includes(file.type)), {
      message: 'กรุณาเลือกรูปภาพที่มีนามสกุล jpg, jpeg, หรือ png',
    })
    .refine((files) => files.every((file) => file.size <= maxSizeOfImage), {
      message: 'กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 3MB',
    }),
  additionalImageUrl: z
    .array(z.instanceof(File))
    .max(20, 'เลือกรูปภาพได้มากสุด 20 รูป')
    .refine((files) => files.every((file) => allowedFileTypes.includes(file.type)), {
      message: 'กรุณาเลือกรูปภาพที่มีนามสกุล jpg, jpeg, หรือ png',
    })
    .refine((files) => files.every((file) => file.size <= maxSizeOfImage), {
      message: 'กรุณาเลือกรูปภาพที่มีขนาดไม่เกิน 3MB',
    }),
});

export const defaultValue = {
  name: '',
  types: [],
  condition: '',
  amount: 0,
  unit: '',
  detail: '',
  moreDetail: '',

  ownerName: '',
  phoneNumber: '',
  province: null,
  district: null,
  // address: ',',
  location: { latitude: 0, longitude: 0 },
  image: [],
  additionalImageUrl: [],
};

export const informationForm: (keyof FormValues)[] = [
  'name',
  'types',
  'condition',
  'amount',
  'unit',
  'detail',
  'moreDetail',
];

export const ownerForm: (keyof FormValues)[] = ['ownerName', 'phoneNumber', 'province', 'district'];

export type FormValues = z.infer<typeof formSchema>;
