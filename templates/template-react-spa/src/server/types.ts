export type Response<T> = {
  status: string;
  ok: boolean;
  data: T;
};
