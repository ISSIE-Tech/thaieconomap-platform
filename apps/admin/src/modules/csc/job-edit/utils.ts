import type { JobPost } from '../types';
import type { FormSchema } from './form-schema';

export const toFormValues = (job: JobPost): FormSchema => ({
  title: job.title ?? '',
  category: job.category?._id ?? '',
  description: job.description ?? '',
  workload: job.workload ?? '',
  qualification: job.qualification ?? '',
  applicants: job.applicants?.number ?? 1,
  wageAmount: job.wage?.amount ?? 0,
  wageUnit: job.wage?.unit ?? '',
  startDate: new Date(job.startDate),
  endDate: new Date(job.endDate),
  closeDate: job.closeDate ? new Date(job.closeDate) : null,
  images: job.imageUrls ?? [],
});

/** the endpoint is multipart (it also accepts images), so nested values go as JSON */
export const toFormData = (values: FormSchema): FormData => {
  const formData = new FormData();

  formData.append('title', values.title);
  formData.append('category', values.category);
  formData.append('description', values.description);
  formData.append('workload', values.workload);
  formData.append('qualification', values.qualification);
  formData.append('applicants', JSON.stringify({ number: values.applicants }));
  formData.append('wage', JSON.stringify({ amount: values.wageAmount, unit: values.wageUnit }));
  formData.append('startDate', values.startDate.toISOString());
  formData.append('endDate', values.endDate.toISOString());

  if (values.closeDate) {
    formData.append('closeDate', values.closeDate.toISOString());
  }

  // urls are images the admin kept; Files are new uploads
  const kept = values.images.filter((image): image is string => typeof image === 'string');

  formData.append('keepImages', JSON.stringify(kept));

  values.images
    .filter((image): image is File => image instanceof File)
    .forEach((file) => formData.append('images', file));

  return formData;
};
