import { rememberPendingJob, takePendingJobPath } from './pending-job';

// node test env: a minimal sessionStorage is enough
const store = new Map<string, string>();
Object.assign(globalThis, {
  sessionStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
});

describe('pending job', () => {
  beforeEach(() => store.clear());

  it('opens the job from ?jobId= once, then falls back to home', () => {
    rememberPendingJob('?jobId=6ab288fca6aa0adc35b8e079');

    expect(takePendingJobPath()).toBe('/job/6ab288fca6aa0adc35b8e079');
    expect(takePendingJobPath()).toBe('/');
  });

  it('keeps the remembered job when a later page has no jobId', () => {
    rememberPendingJob('?jobId=abc');
    rememberPendingJob('?code=line-login');

    expect(takePendingJobPath()).toBe('/job/abc');
  });
});
