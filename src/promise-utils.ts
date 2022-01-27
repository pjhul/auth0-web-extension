const singlePromiseMap: Record<string, Promise<any>> = {};

export const delay = (ms: number) => new Promise<void>(resolve => {
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

export const retryPromise = async <T>(
  cb: () => Promise<T>,
  maxNumberOfRetries = 3
): Promise<T | null> => {
  for (let i = 0; i < maxNumberOfRetries; i++) {
    try {
      const result = await cb();
      return result;
    } catch(error) {
      console.log(error)
      continue;
    }
  }

  return null;
};
