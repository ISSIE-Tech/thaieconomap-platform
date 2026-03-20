// Define the tab structure and types
export const FAVORITE_TABS = {
  ECONOMAP: {
    en: 'economap',
    th: 'แผนที่ธุรกิจ',
  },
  PUMPUANGS: {
    en: 'pumpuang',
    th: 'รถพุ่งพวง',
  },
  // JOBS: {
  //   en: 'jobs',
  //   th: 'งานและอาชีพ',
  // },
  ITEMS: {
    en: 'items',
    th: 'สิ่งของ',
  },
} as const;

export type TabKey = keyof typeof FAVORITE_TABS; // 'ECONOMAP' | 'JOBS' | 'ITEMS'
export type TabValue = (typeof FAVORITE_TABS)[TabKey]['en']; // 'economap' | 'jobs' | 'items'
