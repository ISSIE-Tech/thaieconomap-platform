import Stack from '@mui/material/Stack';

import { ImageFormContainer } from './image-form-container';

const ImageForm = () => (
  <Stack
    useFlexGap
    direction={{ xs: 'column', md: 'row' }}
    gap={5}
    sx={{ width: '100%', height: 'auto', '& > *': { flex: 1, minWidth: 0 } }}
  >
    <ImageFormContainer
      name="image"
      multiple
      label="แตะเพื่ออัปโหลดรูปแบนเนอร์"
      title="เพิ่มรูปแบนเนอร์สิ่งของ"
      description="รูปภาพที่ใช้แสดงเป็นหน้าปก"
    />
    <ImageFormContainer
      name="additionalImageUrl"
      multiple
      label="แตะเพื่ออัปโหลดรูปภาพ"
      title="เพิ่มรูปภาพเพิ่มเติม"
      description="รูปภาพเพิ่มเติม สูงสุด 20 รูป"
    />
  </Stack>
);

export default ImageForm;
