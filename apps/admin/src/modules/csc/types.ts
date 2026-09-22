export type CscDistrict = {
  _id: string;
  provinceName: string;
  districtType: string;
  districtName: string;
};

export type CscUserRole = 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export type CscUser = {
  _id: string;
  // set when the account comes from the thaieconomap gateway; its role is owned by the gateway (roles.CSC)
  authId?: string;
  shortId: string;
  name: string;
  phoneNumber: string;
  role: CscUserRole;
  districts: CscDistrict[];
  profileImageUrl?: string;
};

export type JobCategory = {
  _id: string;
  name: string;
  iconUrl?: string;
  isMain: boolean;
  index: number;
};

export type WageUnit = {
  _id: string;
  name: string;
};

export type JobPostActioner = Pick<CscUser, '_id' | 'shortId' | 'name' | 'role'>;

export type JobPost = {
  _id: string;
  title: string;
  category: JobCategory;
  description: string;
  status: string;
  rejectMessage?: string;
  applicants: { number: number };
  wage: { amount: number; unit: string };
  startDate: string;
  endDate: string;
  closeDate?: string;
  workload: string;
  qualification: string;
  imageUrls: string[];
  location: {
    address: { name: string; district: CscDistrict };
    latitude: string;
    longitude: string;
  };
  createdBy?: JobPostActioner & { phoneNumber?: string };
  lastModifiedBy?: JobPostActioner;
  createdAt: string;
  updatedAt?: string;
};

// active = approved posts, pending = waiting for review, deleted = recycle bin (30d TTL)
export type JobKind = 'active' | 'pending' | 'deleted';

export const CSC_ROLE_TRANSLATIONS: Record<CscUserRole, string> = {
  ADMIN: 'ผู้ดูแลระบบ',
  MANAGER: 'ผู้จัดการ',
  CUSTOMER: 'ผู้ใช้ทั่วไป',
};
