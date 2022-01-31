const singlePromiseMap: Record<string, Promise<any>> = {};

export const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

export const singlePromise = <T>(cb: () => Promise<T>, key: string) => {
  let promise = singlePromiseMap[key];
  if (!promise) {
    promise = cb().finally(() => {
      delete singlePromiseMap[key];
      promise = undefined;
    });
    singlePromiseMap[key] = promise;
  }
  return promise;
};

export const retryPromise = async (
  cb: () => Promise<boolean>,
  maxNumberOfRetries = 3
) => {
  for (let i = 0; i < maxNumberOfRetries; i++) {
    if (await cb()) {
      return true;
    }
  }

  return false;
};

export const retryPromiseOnReject = async <T>(
  cb: () => Promise<T>,
  maxNumberOfRetries = 3
): Promise<T | null> => {
  for (let i = 0; i < maxNumberOfRetries; i++) {
    try {
      const result = await cb();
      return result;
    } catch (error) {
      continue;
    }
  }

  return null;
};
