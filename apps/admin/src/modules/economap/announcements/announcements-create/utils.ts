import type { FormSchema } from './form-schema';

export const reformatFormData = async (
  data: FormSchema,
): Promise<FormData> => {
  const formData = new FormData();
  const pdfFile = data.pdf?.[0];

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'pdf':
        if (pdfFile) {
          formData.append(key, pdfFile);
        }
        break;
      case 'districts': {
        if (Array.isArray(value)) {
          value.forEach((district, index) => {
            formData.append(`districts[${index}]`, district);
          });
        }
        break;
      }
      default:
        if (typeof value === 'string') {
          formData.append(key, value);
        }
        break;
    }
  }

  return formData;
};
