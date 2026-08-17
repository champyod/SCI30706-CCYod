export class TimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`operation timed out after ${timeoutMs}ms`);
    this.name = "TimeoutError";
  }
}

/**
 * Race a promise against a deadline. If the promise settles first its result
 * (or rejection) propagates; otherwise the returned promise rejects with a
 * TimeoutError so a stalled backend can never hang the UI forever.
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (reason) => {
        clearTimeout(timer);
        reject(reason);
      },
    );
  });
}
