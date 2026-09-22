'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobEditForm } from './job-edit-form';
import { useGetJobById } from '../_hooks/use-csc-jobs';
import { QueryAlert } from '../_components/query-alert';

type Props = {
  jobId: string;
};

export function JobEditPage({ jobId }: Props) {
  const { data: job, error } = useGetJobById('active', jobId);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="แก้ไขงาน"
        links={[
          { name: 'งาน', href: paths.csc.dashboard.jobs.root },
          { name: 'รายการ', href: paths.csc.dashboard.jobs.list },
          { name: job?.title ?? 'แก้ไข' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QueryAlert error={error} />

      {job && <JobEditForm job={job} />}
    </DashboardContent>
  );
}
