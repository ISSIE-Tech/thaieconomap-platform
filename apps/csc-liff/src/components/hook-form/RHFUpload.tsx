import React from 'react';

import { ImageType } from '@/types/image';
import { classNames } from '@/utils/className';

import { useSnackbar } from 'notistack';
import { BsFillImageFill } from 'react-icons/bs';

type Props = {
  images: ImageType[];
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
};

export default function RHFUpload({ images, setImages }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length >= 6 || images.length + files.length > 6) {
      enqueueSnackbar('อัพโหลดได้สูงสุด 6 รูปภาพ', { variant: 'error' });
      return;
    }

    if (files.length > 6) {
      enqueueSnackbar('อัพโหลดได้สูงสุด 6 รูปภาพ', { variant: 'error' });
      return;
    }

    if (
      Array.from(files).some((file) =>
        images.some(
          (image) =>
            file.name === image.name &&
            file.type === image.type &&
            file.size === image.size
        )
      )
    ) {
      enqueueSnackbar('รูปภาพซ้ำกัน', { variant: 'error' });
      return;
    }

    setImages((prev) => [...prev, ...(files as any)]);
  };

  const handleDeleteImage = (image: File) => () => {
    setImages((prev) => prev.filter((item) => item !== image));
  };

  return (
    <>
      <h4 className="text-lg text-ink">เพิ่มรูปภาพที่เกี่ยวข้องกับงาน</h4>

      {/* Images upload */}
      <div className="py-8 bg-filling-orange border-2 border-dashed border-border rounded-xl flex justify-center items-center">
        <label
          htmlFor="image-input"
          className="bg-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <BsFillImageFill className={classNames('text-main-orange')} />
          <h6 className={classNames('text-lg text-granite-50')}>
            แตะเพื่ออัพโหลดรูปภาพ
          </h6>
        </label>
      </div>
      <input
        id="image-input"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />

      {/* Preview Section  */}
      <section className="flex gap-2 items-center flex-wrap">
        {images.map((image, index) => (
          <div key={image.name + image.size + image.type} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(image)}
              alt={`uploaded image ${index}`}
              className="w-20 h-20 object-cover object-top"
            />
            <button
              className="absolute top-0 right-0 bg-white rounded-full w-6 h-6 text-main-orange"
              onClick={handleDeleteImage(image)}
            >
              x
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
