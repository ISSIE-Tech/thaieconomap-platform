import type { Sharing } from 'src/modules/sharings/_types/sharing.type';
import type { Commercial } from 'src/modules/commercials/_types/commercials.type';

export type FormHistory = (Commercial | Sharing) & {
  submissionStatus: SubmissionStatus;
  submissionMessage?: string;
  createdAt: string;
  updatedAt?: string;
  entityType: EntityType;
};

export enum SubmissionStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

// TODO: refactor this
export const ENTITY_TYPE = {
  commercials: {
    en: 'commercials',
    th: 'ธุรกิจ',
  },
  shares: {
    en: 'shares',
    th: 'ช่วยเหลือแบ่งปัน',
  },
  jobs: {
    en: 'jobs',
    th: 'งานและอาชีพ',
  },
} as const;

type EntityType = keyof typeof ENTITY_TYPE;

export const FORM_HISTORY_TABS = {
  PENDING: {
    en: SubmissionStatus.PENDING,
    th: 'กำลังดำเนินการ',
  },
  REJECTED: {
    en: SubmissionStatus.REJECTED,
    th: 'ไม่ผ่าน',
  },
  ACCEPTED: {
    en: SubmissionStatus.ACCEPTED,
    th: 'ผ่านแล้ว',
  },
};
