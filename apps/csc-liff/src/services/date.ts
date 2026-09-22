export function formatCardDate(date: Date) {
  const now = Date.now();
  const diffDays = Math.floor((now - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'วันนี้';

  if (diffDays <= 3) return `${diffDays} วันที่ผ่านมา`;

  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
