// thaieconomap's job map opens csc through `<liff url>?jobId=<id>`. Login and
// registration both send the user elsewhere first, so the id is kept for the session
// and the job is opened once the user is in.

const KEY = 'pendingJobId';

export function rememberPendingJob(search: string) {
  const jobId = new URLSearchParams(search).get('jobId');

  if (jobId) sessionStorage.setItem(KEY, jobId);
}

/** Where to go once signed in: the job that was asked for, or the home page. */
export function takePendingJobPath() {
  const jobId = sessionStorage.getItem(KEY);

  sessionStorage.removeItem(KEY);

  return jobId ? `/job/${encodeURIComponent(jobId)}` : '/';
}
