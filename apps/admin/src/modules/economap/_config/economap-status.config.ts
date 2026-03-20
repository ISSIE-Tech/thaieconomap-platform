export enum ECONOMAP_STATUS {
  APPROVED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  REMOVED = 'REMOVED',
}

export const ECONOMAP_STATUS_TRANSLATIONS: Record<ECONOMAP_STATUS, string> = {
  [ECONOMAP_STATUS.APPROVED]: 'อนุมัติแล้ว',
  [ECONOMAP_STATUS.PENDING]: 'รออนุมัติ',
  [ECONOMAP_STATUS.REJECTED]: 'ไม่อนุมัติ',
  [ECONOMAP_STATUS.REMOVED]: 'ลบ',
};

export const ECONOMAP_STATUS_OPTIONS = Object.values(ECONOMAP_STATUS).map((status) => ({
  value: status,
  label: ECONOMAP_STATUS_TRANSLATIONS[status],
}));
