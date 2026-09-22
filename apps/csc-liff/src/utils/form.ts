export function formatPhoneNumber(phoneNumber: string | undefined = '') {
  if (!phoneNumber) return 'ไม่ทราบ';

  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}

export function formatDateThai(temp: string) {
  const date = new Date(Date.parse(temp));

  const monthNames = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];
  const day = date?.getDate();
  const monthIndex = date?.getMonth();
  const year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + `${year + 543}`;
}
