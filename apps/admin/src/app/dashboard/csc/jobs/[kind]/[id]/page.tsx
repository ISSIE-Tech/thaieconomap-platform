import type { JobKind } from 'src/modules/csc/types';

import { notFound } from 'next/navigation';
import { JobViewPage } from 'src/modules/csc/job-view/job-view-page';

const KINDS: JobKind[] = ['active', 'pending', 'deleted'];

export default async function Page({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;

  if (!KINDS.includes(kind as JobKind)) {
    notFound();
  }

  return <JobViewPage kind={kind as JobKind} id={id} />;
}
