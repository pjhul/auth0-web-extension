import { ClientStorage } from './storage';
import { GetTokenSilentlyResult } from './global';
interface Transaction {
    authorizeUrl: string;
    domainUrl: string;
    nonce: string;
    scope: string;
    audience: string;
    appState?: any;
    code_verifier: string;
    redirect_uri: string;
    organizationId?: string;
    state?: string;
    callback: (authResult: GetTokenSilentlyResult) => void;
    errorCallback: (error: any) => void;
}
export default class TransactionManager {
    private storage;
    private clientId;
    private transaction;
    private storageKey;
    constructor(storage: ClientStorage, clientId: string);
    create(transaction: Transaction): void;
    get(): Transaction | undefined;
    remove(): void;
}
export {};
