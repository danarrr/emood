export enum DataStatus {
  INITIAL = 'initial',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface HasStatus<T> {
  status: DataStatus;
  data: T | null;
}