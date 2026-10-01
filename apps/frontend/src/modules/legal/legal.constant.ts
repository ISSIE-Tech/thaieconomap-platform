import { OUR_CONTACT_NUMBER } from 'src/modules/account/_constants/account.constant';

// Operator (data controller) details quoted in the terms and the privacy policy.
// TODO(legal): fill in the address and email, and have both documents reviewed before launch.
export const LEGAL = {
  serviceName: 'Thai Economap (ไทยอีโค่โนแมป)',
  operator: 'โครงการ ISSIE จุฬาลงกรณ์มหาวิทยาลัย',
  operatorWebsite: 'https://www.issie-chula.org',
  address: 'TODO: ที่อยู่สำหรับติดต่อ',
  email: 'TODO: อีเมลสำหรับติดต่อเรื่องข้อมูลส่วนบุคคล',
  phone: OUR_CONTACT_NUMBER.replace(/^\+66(\d{2})(\d{3})(\d{4})$/, '0$1-$2-$3'),
  // วันที่มีผลบังคับใช้ (updated whenever either document changes)
  effectiveDate: '29 กันยายน 2569',
};
