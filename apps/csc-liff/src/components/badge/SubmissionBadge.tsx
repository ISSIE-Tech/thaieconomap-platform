import { SubmissionStatusType } from '@/types/post';

type Props = {
  submissionStatus: SubmissionStatusType;
  label?: string;
};

export default function SubmissionBadge({
  submissionStatus = 'ACCEPTED',
  label,
}: Props) {
  const options = {
    ACCEPTED: {
      label: 'ผ่านแล้ว',
      varient: 'bg-soft-green text-main-green border border-main-green',
    },
    PENDING: {
      label: 'รอการติดต่อ',
      varient: 'bg-filling-orange text-main-orange border border-main-orange',
    },
    REJECTED: {
      label: 'ไม่ผ่าน',
      varient: 'bg-soft-red text-main-red border border-main-red',
    },
    CANCELLED: {
      label: 'ยกเลิกแล้ว',
      varient: 'bg-soft-red text-main-red border border-main-red',
    },
    EXPIRED: {
      label: 'หมดอายุ',
      varient: 'bg-mist text-granite-50 border border-granite-50',
    },
  };

  return (
    <span
      className={`${options[submissionStatus].varient} text-sm font-semibold rounded-full p-1`}
    >
      {label ? label : options[submissionStatus].label}
    </span>
  );
}
