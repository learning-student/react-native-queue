import type { Job } from './types';
// @ts-ignore
import AsyncStorage from  '@react-native-community/async-storage';
import type Worker from './Worker';

export const addJob = async (payload: Job): Promise<Job[]> => {
  let previousJobs = await getJobs();

  const jobs = [...previousJobs, payload];
  await AsyncStorage.setItem('jobs', JSON.stringify(jobs));

  return jobs;
};

export const setJobs = async (jobs: Job[]) =>
  AsyncStorage.setItem('jobs', JSON.stringify(jobs));

export const getJobs = async (): Promise<Job[]> => {
  const jobs = await AsyncStorage.getItem('jobs');

  if (!jobs) {
    return [];
  }

  return JSON.parse(jobs);
};

export const removeJob = async (id: string) => {
  let jobs = await getJobs();
  jobs = jobs.filter((item) => item.id !== id);

  await setJobs(jobs);

  return true;
};

export const updateJob = async (id: string, payload: Job) => {
  let jobs = await getJobs();
  jobs = jobs.map((job) => (job.id === id ? payload : job));
  await setJobs(jobs);

  return jobs;
};

export const removeJobs = async (jobName: string) => {
  let jobs = await getJobs();

  jobs = jobs.filter((job) => job.name !== jobName);

  await setJobs(jobs);

  return jobs;
};

export const filterJobs = (jobs: Job[], queueLifespanRemaining: number) => {
  return jobs.filter((job) => {
    return (
      !job.active &&
      job.failed === false &&
      (queueLifespanRemaining > 0
        ? job.timeout > 0 && job.timeout < queueLifespanRemaining
        : true)
    );
  });
};

export const filterRelatedJobs = (
  jobs: Job[],
  name: string,
  concurrency: number = 8
): Job[] => {
  return jobs.filter((job) => job.name === name).slice(0, concurrency);
};

export const getConcurrentJobs = async (
  queueLifespanRemaining: number = 0,
  worker: Worker
): Promise<Job[]> => {
  let jobs = await getJobs();

  // sort jobs by created at date
  jobs = jobs.sort((a, b) => {
    const bCreatedAt = new Date(b.created).getTime();
    const aCreatedAt = new Date(a.created).getTime();

    // @ts-ignore
    return bCreatedAt - aCreatedAt;
  });

  // sort jobs by priority
  jobs = jobs.sort((a, b) => {
    return b.priority - a.priority;
  });

  const allJobs = filterJobs(jobs, queueLifespanRemaining);

  if (!allJobs.length) {
    return [];
  }

  const nextJob = allJobs[0];
  const concurrency = worker.getConcurrency(nextJob.name);

  return filterRelatedJobs(allJobs, nextJob.name, concurrency);
};

export const markJobsAsActive = async (jobIds: string[]) => {
  let jobs = await getJobs();

  jobs = jobs.map((job) => {
    if (jobIds.includes(job.id)) {
      return { ...job, active: true };
    }

    return job;
  });

  console.log('marked', jobs);
  return setJobs(jobs);
};
