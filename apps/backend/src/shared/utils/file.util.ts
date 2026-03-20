import { MinioClientService } from '../../modules/minio-client/minio-client.service';

export async function transformFileUrl<T>(
  minioClientService: MinioClientService,
  data: T,
): Promise<T> {
  const fileKey = data?.['imageUrl'] ? 'imageUrl' : 'pdfUrl';
  const fileUrl = data[fileKey];
  const isExternalFileUrl = fileUrl?.startsWith('http');

  if (fileUrl && !isExternalFileUrl) {
    data[fileKey] = await minioClientService.getFileUrl(fileUrl);
  }

  data['additionalImageUrl'] = await getAdditionalFileUrl(
    minioClientService,
    data['additionalImageUrl'],
  );

  return data;
}

export async function transformFileUrlsInArray<T>(
  minioClientService: MinioClientService,
  data: T[],
): Promise<T[]> {
  return Promise.all(data.map(item => transformFileUrl(minioClientService, item)));
}

export async function getAdditionalFileUrl(
  minioClientService: MinioClientService,
  additionalFileName: string[],
): Promise<string[]> {
  if (additionalFileName?.length) {
    const instruction = additionalFileName.map(fileName => {
      if (fileName?.startsWith('http')) {
        return fileName;
      }

      return minioClientService.getFileUrl(fileName);
    });

    return Promise.all(instruction);
  }

  return additionalFileName;
}
