export type WorkerCallback = (id: string, payload: any, job : Job) => void;

export type WorkerLifeCycleFunctions = {
  onStart?: WorkerCallback;
  onSuccess?: WorkerCallback;
  onFailure?: WorkerCallback;
  onFailed?: WorkerCallback;
  onComplete?: WorkerCallback;
};

export interface WorkerOptions extends WorkerLifeCycleFunctions {
  concurrency?: number;
}

export type Job = JobOptions & {
  id: string;
  name: string;
  timeout: number;
  payload: string;
  data: string;
  active: boolean;
  created: Date;
  failed: boolean | Date;
};

export type JobOptions = {
  attempts: number;
  priority: number;
  timeout: number;
  waitBeforeRetry ?: number;
}
