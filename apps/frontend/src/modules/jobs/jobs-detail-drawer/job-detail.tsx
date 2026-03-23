'use client';

import type { JobPost } from '../_types/jobs.type';

import { Iconify } from 'src/shared/components/iconify';
import { BulletList } from 'src/shared/components/custom-list';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

type Props = {
  job?: JobPost | null;
};

export function JobDetail({ job }: Props) {
  return (
    <Stack spacing={1} px={3} pb={4}>
      <Typography variant="body1" fontWeight="bold">
        ภาระงาน
      </Typography>

      <List>
        <BulletList text={job?.workload ?? ''} />
      </List>

      <Divider />

      <Typography variant="body1" fontWeight="bold">
        ความชำนาญ
      </Typography>

      <List>
        <BulletList text={job?.qualification ?? ''} />
      </List>

      <Divider />

      <Typography variant="body1" fontWeight="bold">
        การว่าจ้าง
      </Typography>

      <List>
        <BulletList text={`ค่าตอบแทน ${job?.wage.amount} บาท${job?.wage.unit}`} />

        <BulletList text={`เริ่มต้นทำงานตั้งแต่ ${job?.startDate} จนถึง ${job?.endDate}`} />
      </List>

      <Divider />

      <Stack direction="row" spacing={2}>
        <Iconify width={24} icon="carbon:user" my={0.5} />

        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">คุณ{job?.createdBy.name}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
