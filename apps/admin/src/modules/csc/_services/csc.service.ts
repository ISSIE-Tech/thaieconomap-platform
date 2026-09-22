import type { JobKind, JobPost, CscUser, WageUnit, CscDistrict, JobCategory, CscUserRole } from '../types';

import { endpoints } from 'src/configs/endpoints.config';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

// response key per kind: { jobPosts | pendingJobPosts | deletedJobPosts }
const LIST_KEY: Record<JobKind, string> = {
  active: 'jobPosts',
  pending: 'pendingJobPosts',
  deleted: 'deletedJobPosts',
};

export const getJobs = async (kind: JobKind, isAdmin: boolean): Promise<JobPost[]> => {
  // ponytail: one big page (backend caps perPage at 9999) + client-side table; go server-side paging when a district outgrows that
  const res = await axios.get(endpoints.csc.jobs[kind].list(isAdmin), {
    params: { perPage: 9999 },
  });

  return res.data[LIST_KEY[kind]].data;
};

export const getJobById = async (kind: JobKind, id: string): Promise<JobPost> => {
  const res = await axios.get(endpoints.csc.jobs[kind].byId(id));

  return res.data[LIST_KEY[kind].slice(0, -1)];
};

export const recycleJob = (id: string) => axios.delete(endpoints.csc.jobs.active.recycle(id));

export const approveJob = (id: string) => axios.post(endpoints.csc.jobs.pending.approve(id));

export const rejectJob = (id: string, rejectMessage: string) =>
  axios.post(endpoints.csc.jobs.pending.reject(id), { rejectMessage });

export const restoreJob = (id: string) => axios.post(endpoints.csc.jobs.deleted.restore(id));

export const destroyJob = (id: string) => axios.delete(endpoints.csc.jobs.deleted.byId(id));

// ----------------------------------------------------------------------

export const getJobCategories = async (): Promise<JobCategory[]> => {
  const res = await axios.get(endpoints.csc.jobCategories.root);

  return res.data.jobCategories;
};

export const createJobCategory = (params: FormData) =>
  axios.post(endpoints.csc.jobCategories.root, params);

export const deleteJobCategory = (id: string) => axios.delete(endpoints.csc.jobCategories.byId(id));

export const arrangeJobCategories = (jobCategories: string[]) =>
  axios.patch(endpoints.csc.jobCategories.arrange, { jobCategories });

// ----------------------------------------------------------------------

export const getWageUnits = async (): Promise<WageUnit[]> => {
  const res = await axios.get(endpoints.csc.wageUnits.root);

  return res.data.wageUnits;
};

export const createWageUnit = (name: string) => axios.post(endpoints.csc.wageUnits.root, { name });

export const deleteWageUnit = (id: string) => axios.delete(endpoints.csc.wageUnits.byId(id));

// ----------------------------------------------------------------------

export const getCscUsers = async (): Promise<CscUser[]> => {
  const res = await axios.get(endpoints.csc.users.root);

  return res.data.users;
};

export const updateCscUserRole = (shortId: string, role: CscUserRole) =>
  axios.patch(endpoints.csc.users.role, { shortId, role });

export const updateCscUserDistricts = (user: CscUser, districts: string[]) =>
  axios.patch(endpoints.csc.users.districts(user._id), { shortId: user.shortId, districts });

export const getCscDistricts = async (): Promise<CscDistrict[]> => {
  const res = await axios.get(endpoints.csc.districts);

  return res.data.districts;
};
