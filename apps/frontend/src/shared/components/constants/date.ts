// use array not object since the key is index anyways
export const dayOfWeekThai = [
  'จันทร์', // Monday
  'อังคาร', // Tuesday
  'พุธ', // Wednesday
  'พฤหัส', // Thursday
  'ศุกร์', // Friday
  'เสาร์', // Saturday
  'อาทิตย์', // Sunday
];

export const thaiMonths = [
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

export const monthEngThaiMap = {
  January: 'มกราคม',
  February: 'กุมภาพันธ์',
  March: 'มีนาคม',
  April: 'เมษายน',
  May: 'พฤษภาคม',
  June: 'มิถุนายน',
  July: 'กรกฎาคม',
  August: 'สิงหาคม',
  September: 'กันยายน',
  October: 'ตุลาคม',
  November: 'พฤศจิกายน',
  December: 'ธันวาคม',
};

// mainly for history row (history page)
export const shortMonthEngThaiMap = {
  Jan: 'ม.ค.',
  Feb: 'ก.พ.',
  Mar: 'มี.ค.',
  Apr: 'เม.ย.',
  May: 'พ.ค.',
  Jun: 'มิ.ย.',
  Jul: 'ก.ค.',
  Aug: 'ส.ค.',
  Sep: 'ก.ย.',
  Oct: 'ต.ค.',
  Nov: 'พ.ย.',
  Dec: 'ธ.ค.',
};

export const replaceShortMonthToThai = (dateStr: string): string => {
  const shortMonthsRegex = new RegExp(
    Object.keys(shortMonthEngThaiMap).join('|'), // Create regex like `Jan|Feb|Mar|...`
    'g' // Global flag to replace all matches
  );

  return dateStr.replace(
    shortMonthsRegex,
    (matchedMonth) => shortMonthEngThaiMap[matchedMonth as keyof typeof shortMonthEngThaiMap]
  );
};

// mainly for sharing board drawer
const timeExpressionMap = {
  'a few seconds': 'ไม่กี่วินาที',
  'a minute': 'หนึ่งนาที',
  'a few minutes': 'ไม่กี่นาที',
  'an hour': 'หนึ่งชั่วโมง',
  'a few hours': 'ไม่กี่ชั่วโมง',
  'a day': 'หนึ่งวัน',
  'a few days': 'ไม่กี่วัน',
  'a month': 'หนึ่งเดือน',
  'a few months': 'ไม่กี่เดือน',
  'a year': 'หนึ่งปี',
};

export const translateTimeExpressionEngThai = (engTimeExpression: string): string => {
  // Direct match from timeExpressionMap
  if (engTimeExpression in timeExpressionMap) {
    return timeExpressionMap[engTimeExpression as keyof typeof timeExpressionMap];
  }

  // Handle patterns like "x seconds", "x minutes", etc.
  const [amount, unit] = engTimeExpression.split(' ');
  switch (unit) {
    case 'second':
    case 'seconds':
      return `${amount} วินาที`;
    case 'minute':
    case 'minutes':
      return `${amount} นาที`;
    case 'hour':
    case 'hours':
      return `${amount} ชั่วโมง`;
    case 'day':
    case 'days':
      return `${amount} วัน`;
    case 'month':
    case 'months':
      return `${amount} เดือน`;
    case 'year':
    case 'years':
      return `${amount} ปี`;
    default:
      return 'ค่าเวลาไม่ถูกต้อง';
  }
};

export const formatCreateDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${shortMonthEngThaiMap[month as keyof typeof shortMonthEngThaiMap]} ${year}, ${hours}:${minutes}`;
};
