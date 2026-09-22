'use client';

import type { JobKind } from '../types';

import { DashboardContent } from 'src/layouts/dashboard';

import { Box, Card, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useGetJobById } from '../_hooks/use-csc-jobs';
import { JobActions } from '../job-list/components/job-actions';

const BACK: Record<JobKind, { name: string; href: string }> = {
  active: { name: 'รายการ', href: paths.csc.dashboard.jobs.list },
  pending: { name: 'รออนุมัติ', href: paths.csc.dashboard.jobs.pending },
  deleted: { name: 'ลบ', href: paths.csc.dashboard.jobs.deleted },
};

type Props = {
  kind: JobKind;
  id: string;
};

export function JobViewPage({ kind, id }: Props) {
  const router = useRouter();
  const { data: job } = useGetJobById(kind, id);

  if (!job) {
    return null;
  }

  const district = job.location?.address?.district;

  const details: [string, React.ReactNode][] = [
    ['ประเภทงาน', job.category?.name],
    ['รายละเอียดงานเบื้องต้น', job.description],
    ['ภาระงานโดยละเอียด', job.workload],
    ['คุณสมบัติที่ต้องการ', job.qualification],
    ['จำนวนตำแหน่งที่เปิดรับ', `${job.applicants?.number ?? '-'} ตำแหน่ง`],
    ['ค่าตอบแทน', `${job.wage?.amount?.toLocaleString() ?? '-'} ${job.wage?.unit ?? ''}`],
    ['เริ่มงาน', fDate(job.startDate)],
    ['สิ้นสุดงาน', fDate(job.endDate)],
    ['ปิดรับสมัคร', job.closeDate ? fDate(job.closeDate) : '-'],
    ['ที่ทำงาน', job.location?.address?.name],
    ['เขต', district ? `${district.districtType}${district.districtName} ${district.provinceName}` : '-'],
    ['พิกัด', `${job.location?.latitude}, ${job.location?.longitude}`],
    ['ชื่อผู้ประกาศ', job.createdBy?.name],
    ['เบอร์โทรศัพท์', job.createdBy?.phoneNumber],
    ['ประกาศเมื่อ', fDate(job.createdAt)],
    ...(job.rejectMessage ? ([['เหตุผลที่ปฏิเสธ', job.rejectMessage]] as [string, string][]) : []),
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={job.title}
        links={[{ name: 'งาน', href: paths.csc.dashboard.jobs.root }, BACK[kind], { name: job.title }]}
        action={
          <Stack direction="row" spacing={1}>
            <JobActions kind={kind} id={id} variant="button" onDone={() => router.push(BACK[kind].href)} />
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          {details.map(([label, value]) => (
            <Box key={label} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr' }, gap: 1 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {value || '-'}
              </Typography>
            </Box>
          ))}

          {!!job.imageUrls?.length && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {job.imageUrls.map((url) => (
                <Box
                  key={url}
                  component="img"
                  alt={job.title}
                  src={url}
                  sx={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 1.5 }}
                />
              ))}
            </Box>
          )}
        </Stack>
      </Card>
    </DashboardContent>
  );
}
