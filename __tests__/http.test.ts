import fetch from 'unfetch';

import { MfaRequiredError } from '../src/errors';
import { fetchWithTimeout, fetchJSON } from '../src/http';

jest.mock('unfetch');

const mockUnfetch = <jest.Mock>fetch;

describe('fetchWithTimeout', () => {
  it('clears timeout when successful', async () => {
    mockUnfetch.mockImplementation(
      jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(),
      })
    );

    jest.spyOn(window, 'clearTimeout');
    await fetchWithTimeout('https://test.com/', {}, undefined);
    expect(clearTimeout).toBeCalledTimes(1);
  });

  // TODO: Test timeout
});

describe('fetchJSON', () => {
  it('throws MfaRequiredError when mfa_required is returned', async () => {
    mockUnfetch.mockImplementation(
      jest.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'mfa_required' }),
      })
    );

    await expect(
      fetchJSON('https://test.com/', {}, undefined)
    ).rejects.toBeInstanceOf(MfaRequiredError);
  });

  it('reads the mfa_token when mfa_required is returned', async () => {
    mockUnfetch.mockImplementation(
      jest.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({ error: 'mfa_required', mfa_token: '1234' }),
      })
    );

    await expect(
      fetchJSON('https://test.com/', {}, undefined)
    ).rejects.toHaveProperty('mfa_token', '1234');
  });
});
