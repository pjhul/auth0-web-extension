/**
 * @jest-environment jsdom
 */
import {
  retryPromise,
  singlePromise,
  delay,
  retryPromiseOnReject,
} from '../src/promise-utils';

describe('Promise Utils', () => {
  describe('delay', () => {
    it('resolves after delaying', async () => {
      const cb = jest.fn();

      await delay(100).then(cb);

      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  describe('singlePromise', () => {
    it('reuses the same promise when the key matches', async () => {
      const cb = jest.fn().mockResolvedValue({});

      await Promise.all([
        singlePromise(cb as any, 'test-key'),
        singlePromise(cb as any, 'test-key'),
      ]);

      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('does not reuse the same promise when the key is different', async () => {
      const cb = jest.fn().mockResolvedValue({});

      await Promise.all([
        singlePromise(cb as any, 'test-key'),
        singlePromise(cb as any, 'test-key2'),
      ]);

      expect(cb).toHaveBeenCalledTimes(2);
    });

    it('does not reuse the same promise when the key matches but the first promise resolves before calling the second', async () => {
      const cb = jest.fn().mockResolvedValue({});

      await singlePromise(cb as any, 'test-key');
      await singlePromise(cb as any, 'test-key');

      expect(cb).toHaveBeenCalledTimes(2);
    });
  });

  describe('retryPromiseOnReject', () => {
    it('does not retry promise when it resolves', async () => {
      const cb = jest.fn().mockResolvedValue(true);

      const value = await retryPromiseOnReject(cb as any);

      expect(value).toBe(true);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it('retries promise until it resolves', async () => {
      let i = 1;
      const cb = jest.fn().mockImplementation(() => {
        if (i === 3) {
          return Promise.resolve(true);
        }

        i++;
        return Promise.reject('Promise failed');
      });

      const value = await retryPromiseOnReject(cb as any);

      expect(value).toBe(true);
      expect(cb).toHaveBeenCalledTimes(3);
    });

    it('resolves to null when all retries reject', async () => {
      const cb = jest.fn().mockRejectedValue('Promise failed');

      const value = await retryPromiseOnReject(cb as any, 5);

      expect(value).toBe(null);
      expect(cb).toHaveBeenCalledTimes(5);
    });
  });
});
