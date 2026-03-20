import type { UseBooleanReturn } from 'src/hooks/use-boolean';
import type { UseMutateAsyncFunction } from '@tanstack/react-query';
import type { EconomapError, AdditionalImageUpload } from 'src/types/economap.type';

import { toast } from 'sonner';

export const mapAdditionalImage = async (
  images: File[],
  createAdditionalImage: UseMutateAsyncFunction<any, EconomapError, FormData, unknown>,
  loading: UseBooleanReturn
): Promise<AdditionalImageUpload[]> => {
  const imageList: File[] = [];
  const handleImageUpload = async (batch: File[]) => {
    const formData = new FormData();

    batch.forEach((image) => {
      formData.append('image', image);
    });

    return createAdditionalImage(formData, {
      onError: (error) => {
        toast.error(error.display);
        loading.onFalse();
      },
    });
  };

  const uploadPromises: Promise<AdditionalImageUpload>[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const image of images) {
    if (imageList.length < 5) {
      imageList.push(image);
    } else {
      uploadPromises.push(handleImageUpload([...imageList]));
      imageList.length = 0;
      imageList.push(image);
    }
  }

  if (imageList.length > 0) {
    uploadPromises.push(handleImageUpload(imageList));
  }

  const uploadResult = await Promise.all(uploadPromises);

  return uploadResult;
};

//---------------------------------------------------------

export const getNewUrlList = (files: File[],startUrl:string) => {
    const oldUrls: string[] = [];
    const newFiles: File[] = [];
  
    files.forEach((file) => {
      if (file.name.startsWith(startUrl)) {
        oldUrls.push(file.name);
      } else {
        newFiles.push(file);
      }
    });
  
    return {
      oldUrls,
      newFiles,
    };
  };
