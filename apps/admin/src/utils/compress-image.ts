import imageCompression from 'browser-image-compression';

// ----------------------------------------------------------------------

export const MAX_IMAGE_SIZE_MB = 3;

const DEFAULT_OPTIONS = {
  maxSizeMB: MAX_IMAGE_SIZE_MB,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.8,
};

const COMPRESSIBLE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function compressImageFile(file: File): Promise<File> {
  if (!COMPRESSIBLE_TYPES.includes(file.type)) {
    return file;
  }

  if (file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, DEFAULT_OPTIONS);
    return new File([compressed], file.name, {
      type: compressed.type || file.type,
      lastModified: Date.now(),
    });
  } catch (err) {
    console.error('compressImageFile error:', err);
    return file;
  }
}

export async function compressImageFiles(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImageFile));
}
