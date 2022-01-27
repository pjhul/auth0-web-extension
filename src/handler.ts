import browser from "webextension-polyfill"

import {
  PARENT_PORT_NAME,
  CHILD_PORT_NAME,
} from "./constants"

import {
  AuthenticationResult,
} from "./global"

import {
  TimeoutError,
  GenericError,
} from "./errors"

// We can probably pull redirectUri from background script at some point
export function handleTokenRequest(redirectUri: string) {
  browser.runtime.onMessage.addListener(() => {
    return Promise.resolve("ack");
  });

  console.log(window.location.origin)

  if(window.location.origin === redirectUri) {
    const port = browser.runtime.connect(undefined, { name: CHILD_PORT_NAME })

    const handler = async (message: any, port: browser.Runtime.Port) => {
      if(port.name === CHILD_PORT_NAME) {
        const { authorizeUrl, domainUrl } = message

        const codeResult = await runIFrame(
          authorizeUrl,
          domainUrl,
          60
        );

        port.postMessage(codeResult);
      }
    }

    port.onMessage.addListener(handler);
  } else {
    browser.runtime.onConnect.addListener(port => {
      if(port.name === PARENT_PORT_NAME) {
        const handler = () => {
          const iframe = document.createElement("iframe");

          iframe.setAttribute("width", "0");
          iframe.setAttribute("height", "0");
          iframe.style.display = "none";

          document.body.appendChild(iframe);
          iframe.setAttribute("src", redirectUri);

          port.onMessage.removeListener(handler);
          port.onDisconnect.addListener(() => {
            window.document.body.removeChild(iframe);
          });
        };

        port.onMessage.addListener(handler);
      }
    });
  }
}

const runIFrame = async (
  authorizeUrl: string,
  eventOrigin: string,
  timeoutInSeconds: number = 60
) => {
  return new Promise<AuthenticationResult>((res, rej) => {
    const iframe = window.document.createElement("iframe");

    iframe.setAttribute("width", "0");
    iframe.setAttribute("height", "0");
    iframe.style.display = "none";

    const removeIframe = () => {
      if(window.document.body.contains(iframe)) {
        window.document.body.removeChild(iframe);
        window.removeEventListener("message", iframeEventHandler, false);
      }
    };

    let iframeEventHandler: (e: MessageEvent) => void;

    const timeoutSetTimeoutId = setTimeout(() => {
      rej(new TimeoutError());
      removeIframe();
    }, timeoutInSeconds * 1000);

    iframeEventHandler = function (e: MessageEvent) {
      console.log(e)

      if(e.origin != eventOrigin) return;
      if(!e.data || e.data.type !== "authorization_response") return

      const eventSource = e.source;

      if(eventSource) {
        (eventSource as any).close();
      }

      e.data.response.error
        ? rej(GenericError.fromPayload(e.data.response))
        : res(e.data.response);

      clearTimeout(timeoutSetTimeoutId);
      window.removeEventListener("message", iframeEventHandler, false);

      // Delay the removal of the iframe to prevent hanging loading state
      // in Chrome: https://github.com/auth0/auth0-spa-js/issues/240
      setTimeout(removeIframe, 2 * 1000);
    };

    window.addEventListener("message", iframeEventHandler, false);
    window.document.body.appendChild(iframe);
    iframe.setAttribute("src", authorizeUrl);
  });
}
