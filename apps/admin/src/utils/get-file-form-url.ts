//------------------------------------------------------------------------------------------------

import { CONFIG } from 'src/config-global';

export const createFileFormUrl = async (
  urlList: string[],
  type: 'image' | 'pdf'
): Promise<File[]> => Promise.all(urlList.map((url) => getFile(url, type)));

export const getFile = async (url: string, type: string) => {
  const thaiEcoUrl = CONFIG.site.storageURL;
  const resp = await fetch(url);
  const blob = await resp.blob();
  const mimeType = type === 'image' ? `image/${getImageType(url)}` : 'application/pdf';
  const newUrl = url.split(thaiEcoUrl)[1].split('?')[0];
  return new File([blob], newUrl, { type: mimeType });
};

const getImageType = (url: string) => {
  const match = url.match(/\.(\w+)(?:\?|$)/);
  return match ? match[1] : 'Unknown';
};
