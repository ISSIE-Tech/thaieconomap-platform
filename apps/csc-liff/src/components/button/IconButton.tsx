import Image from 'next/image';
import { classNames } from '@/utils/className';

type IconButtonProps = {
  image: string;
  label: string;
  callback: () => void;
  disabled?: boolean;
};

export default function IconButton({
  image,
  label,
  callback,
  disabled = false,
}: IconButtonProps) {
  return (
    <button
      className={classNames(
        'flex flex-col items-center w-full py-4 rounded-xl bg-paper-100',
        disabled ? 'bg-cloud text-granite-50' : ''
      )}
      disabled={disabled}
      onClick={callback}
    >
      <div className="w-16 h-16 flex justify-center items-center">
        <Image
          src={image}
          alt="something from image"
          width={48}
          height={48}
          className={disabled ? 'grayscale hue-rotate-15' : ''}
        />
      </div>
      <p className="mt-2">{label}</p>
    </button>
  );
}
