import browser from "webextension-polyfill"

import {
  AuthenticationResult,
} from "./global"

import {
  TimeoutError,
  GenericError,
} from "./errors"

export async function handleTokenRequest() {
  const response = await browser.runtime.sendMessage(undefined, "auth_params");
  const codeResult = await runIFrame(response.authorizeUrl, response.domainUrl, 60);
  await browser.runtime.sendMessage(undefined, codeResult);
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
