import { AcceptanceStatusType } from '@/types/post';

type Props = {
  acceptanceStatus: AcceptanceStatusType;
  label?: string;
};

const options = {
  AVAILABLE: {
    label: 'ว่างอยู่',
    varient: 'bg-soft-green text-main-green border border-main-green',
  },
  ALMOST_FULL: {
    label: 'ใกล้เต็ม',
    varient: 'bg-filling-orange text-main-orange border border-main-orange',
  },
  FULL: {
    label: 'เต็มแล้ว',
    varient: 'bg-soft-red text-main-red border border-main-red',
  },
};

export default function BadgeStatus({
  acceptanceStatus = 'AVAILABLE',
  label,
}: Props) {
  return (
    <span
      className={`${options[acceptanceStatus].varient} text-sm font-semibold rounded-full p-1`}
    >
      {label ? label : options[acceptanceStatus].label}
    </span>
  );
}
