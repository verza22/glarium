// shared/types/failedJob.ts
export interface FailedJob {
    id: number;
    connection: string;
    queue: string;
    payload: string;
    exception: string;
    failedAt: Date;
  }