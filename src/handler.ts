import { parseQueryResult } from './utils';
import { AuthenticationResult } from './global';

import { TimeoutError, GenericError } from './errors';

import Messenger from './messenger';

// We can probably pull redirectUri from background script at some point
export async function handleTokenRequest(
  redirectUri: string,
  options?: { debug: boolean }
) {
  const messenger = new Messenger();

  const { debug = false } = options || {};

  if (window.location.origin === redirectUri) {
    if (
      window.location.search.includes('code=') &&
      window.location.search.includes('state=')
    ) {
      const results = parseQueryResult(window.location.search.slice(1));

      if (debug) {
        console.log('[auth0-web-extension] Returning results');
      }

      await messenger.sendRuntimeMessage({
        type: 'auth-result',
        payload: results,
      });

      if (window.opener) {
        window.close();
      }
    } else {
      const { authorizeUrl, domainUrl } = await messenger.sendRuntimeMessage({
        type: 'auth-params',
      });

      if (debug) {
        console.log('[auth0-web-extension] Creating /authorize url IFrame');
      }

      try {
        const codeResult = await runIFrame(authorizeUrl, domainUrl, 60, debug);

        await messenger.sendRuntimeMessage({
          type: 'auth-result',
          payload: codeResult,
        });
      } catch (error) {
        await messenger.sendRuntimeMessage({
          type: 'auth-error',
          error: error as GenericError,
        });
      }
    }
  } else {
    let iframe: HTMLIFrameElement;

    messenger.addMessageListener(message => {
      switch (message.type) {
        case 'auth-start':
          if (debug) {
            console.log('[auth0-web-extension] Create redirect uri IFrame');
          }

          iframe = document.createElement('iframe');

          iframe.setAttribute('width', '0');
          iframe.setAttribute('height', '0');
          iframe.style.display = 'none';

          document.body.appendChild(iframe);
          iframe.setAttribute('src', redirectUri);
          break;

        case 'auth-cleanup':
          if (debug) {
            console.log('[auth0-web-extension] Cleaning up IFrame');
          }

          if (iframe) {
            window.document.body.removeChild(iframe);
          }
          break;

        case 'auth-ack':
          return 'ack';

        default:
          throw new Error(`Unexpected message type ${message.type}`);
      }
    });
  }
}

const runIFrame = async (
  authorizeUrl: string,
  eventOrigin: string,
  timeoutInSeconds: number = 60,
  debug: boolean
) => {
  return new Promise<AuthenticationResult>((res, rej) => {
    const iframe = window.document.createElement('iframe');

    iframe.setAttribute('width', '0');
    iframe.setAttribute('height', '0');
    iframe.style.display = 'none';

    if (debug) console.log('[auth0-web-extension] created authorize iframe');

    const removeIframe = () => {
      if (window.document.body.contains(iframe)) {
        if (debug)
          console.log('[auth0-web-extension] removing authorize iframe');

        window.document.body.removeChild(iframe);
        window.removeEventListener('message', iframeEventHandler, false);
      }
    };

    let iframeEventHandler: (e: MessageEvent) => void;

    const timeoutSetTimeoutId = setTimeout(() => {
      rej(new TimeoutError());
      removeIframe();
    }, timeoutInSeconds * 1000);

    iframeEventHandler = function (e: MessageEvent) {
      if (e.origin != eventOrigin) return;
      if (!e.data || e.data.type !== 'authorization_response') return;

      const eventSource = e.source;

      if (eventSource) {
        (eventSource as any).close();
      }

      if (debug)
        console.log(
          '[auth0-web-extension] received message from authorize iframe'
        );

      e.data.response.error
        ? rej(GenericError.fromPayload(e.data.response))
        : res(e.data.response);

      clearTimeout(timeoutSetTimeoutId);
      window.removeEventListener('message', iframeEventHandler, false);

      // Delay the removal of the iframe to prevent hanging loading state
      // in Chrome: https://github.com/auth0/auth0-spa-js/issues/240
      setTimeout(removeIframe, 2 * 1000);
    };

    window.addEventListener('message', iframeEventHandler, false);
    window.document.body.appendChild(iframe);
    iframe.setAttribute('src', authorizeUrl);
  });
};
