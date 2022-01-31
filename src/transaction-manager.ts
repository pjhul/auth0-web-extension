import { ClientStorage } from './storage';

import { GetTokenSilentlyResult } from './global';

const TRANSACTION_STORAGE_KEY_PREFIX = 'a0.webext.txs';

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
}

export default class TransactionManager {
  private transaction: Transaction | undefined;
  private storageKey: string;

  constructor(private storage: ClientStorage, private clientId: string) {
    this.storageKey = `${TRANSACTION_STORAGE_KEY_PREFIX}.${this.clientId}`;
    this.transaction = this.storage.get(this.storageKey);
  }

  public create(transaction: Transaction) {
    this.transaction = transaction;

    this.storage.save(this.storageKey, transaction, {
      daysUntilExpire: 1,
    });
  }

  public get(): Transaction | undefined {
    return this.transaction;
  }

  public remove() {
    delete this.transaction;
    this.storage.remove(this.storageKey);
  }
}
