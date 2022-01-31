import browser from 'webextension-polyfill';

import { AuthenticationResult } from './global';

export type AuthStartMessage = {
  type: 'auth-start';
};

export type AuthParamsMessage = {
  type: 'auth-params';
};

export type AuthCleanUpMessage = {
  type: 'auth-cleanup';
};

export type AuthAckMessage = {
  type: 'auth-ack';
};

export type AuthResultMessage = {
  type: 'auth-result';
  payload: AuthenticationResult;
};

export type Message =
  | AuthStartMessage
  | AuthParamsMessage
  | AuthCleanUpMessage
  | AuthAckMessage
  | AuthResultMessage;

export type MessageResponse<M extends Message> = M extends AuthStartMessage
  ? void
  : M extends AuthParamsMessage
  ? {
      authorizeUrl: string;
      domainUrl: string;
    }
  : M extends AuthCleanUpMessage
  ? void
  : M extends AuthResultMessage
  ? void
  : M extends AuthAckMessage
  ? 'ack'
  : never;

type WrappedMessage = Message & {
  source: 'auth0-web-extension';
};

export default class Messenger {
  public sendTabMessage<M extends Message>(
    tabId: number,
    message: M
  ): Promise<MessageResponse<M>> {
    const wrappedMessage: WrappedMessage = {
      ...message,
      source: 'auth0-web-extension',
    };

    return browser.tabs.sendMessage(tabId, wrappedMessage);
  }

  public sendRuntimeMessage<M extends Message>(
    message: M
  ): Promise<MessageResponse<M>> {
    const wrappedMessage: WrappedMessage = {
      ...message,
      source: 'auth0-web-extension',
    };

    return browser.runtime.sendMessage(undefined, wrappedMessage);
  }

  public addMessageListener<M extends Message>(
    handler: (
      message: M,
      sender: browser.Runtime.MessageSender
    ) => MessageResponse<M>
  ) {
    browser.runtime.onMessage.addListener((message, sender) => {
      if (message.source === 'auth0-web-extension') {
        return Promise.resolve(handler(message, sender));
      }
    });
  }
}
