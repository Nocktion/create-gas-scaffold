import type { add } from '../../../server/example';

interface GasRunner {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withSuccessHandler(cb: (value: any) => void): GasRunner;
  withFailureHandler(cb: (error: Error) => void): GasRunner;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [method: string]: (...args: any[]) => void;
}

declare const google:
  | {
      script: {
        run: GasRunner;
      };
    }
  | undefined;

function call<T>(fn: string, ...args: unknown[]): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined') {
      reject(new Error(`RPC ${fn} is only available inside the Apps Script host`));
      return;
    }

    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [fn](...args);
  });
}

export const server = {
  add: (...args: Parameters<typeof add>) => call<ReturnType<typeof add>>('add', ...args),
};
