import browser from 'webextension-polyfill';
import { AuthenticationResult } from './global';
export declare type AuthStartMessage = {
    type: 'auth-start';
};
export declare type AuthParamsMessage = {
    type: 'auth-params';
};
export declare type AuthCleanUpMessage = {
    type: 'auth-cleanup';
};
export declare type AuthAckMessage = {
    type: 'auth-ack';
};
export declare type AuthResultMessage = {
    type: 'auth-result';
    payload: AuthenticationResult;
};
export declare type Message = AuthStartMessage | AuthParamsMessage | AuthCleanUpMessage | AuthAckMessage | AuthResultMessage;
export declare type MessageResponse<M extends Message> = M extends AuthStartMessage ? void : M extends AuthParamsMessage ? {
    authorizeUrl: string;
    domainUrl: string;
} : M extends AuthCleanUpMessage ? void : M extends AuthResultMessage ? void : M extends AuthAckMessage ? 'ack' : never;
export default class Messenger {
    sendTabMessage<M extends Message>(tabId: number, message: M): Promise<MessageResponse<M>>;
    sendRuntimeMessage<M extends Message>(message: M): Promise<MessageResponse<M>>;
    addMessageListener<M extends Message>(handler: (message: M, sender: browser.Runtime.MessageSender) => MessageResponse<M>): void;
}
