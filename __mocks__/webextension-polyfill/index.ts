import browser from 'webextension-polyfill';

type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};

const mockBrowser = jest.createMockFromModule<Writeable<typeof browser>>(
  'webextension-polyfill'
);

let storage = {};

mockBrowser.tabs = {
  ...mockBrowser.tabs,
  create: () =>
    Promise.resolve({
      index: 0,
      id: 123,
      highlighted: false,
      active: true,
      incognito: false,
      pinned: false,
    }),
};

mockBrowser.storage = {
  // TODO: Implement
  onChanged: {
    removeListener: () => {},
    hasListener: () => false,
    hasListeners: () => false,
    addListener: () => {},
  },
  // TODO: Implement
  // @ts-ignore
  sync: {},

  local: {
    QUOTA_BYTES: 5242880,

    get: (
      keys?: string | string[] | Record<string, any>
    ): Promise<Record<string, any>> => {
      if (!keys) {
        return Promise.resolve(storage);
      } else if (typeof keys === 'string') {
        return Promise.resolve({ [keys]: storage[keys] });
      } else {
        return Promise.resolve(
          Object.fromEntries(
            Object.keys(keys).map(key => {
              return [key, storage[key]];
            })
          )
        );
      }
    },

    set: (items: Record<string, any>): Promise<void> => {
      storage = {
        ...storage,
        ...items,
      };

      return Promise.resolve();
    },

    clear: () => {
      storage = {};
      return Promise.resolve();
    },

    remove: (keys: string | string[]): Promise<void> => {
      if (typeof keys === 'string') {
        delete storage[keys];
      } else {
        keys.forEach(key => {
          delete storage[key];
        });
      }

      return Promise.resolve();
    },
  },
};

let listeners: Listener[] = [];

mockBrowser.runtime.sendMessage = async (id, message) => {
  for await (let listener of listeners) {
    await listener(message, {});
  }

  return Promise.resolve();
};

type Listener = (
  message: any,
  sender: browser.Runtime.MessageSender
) => Promise<any> | void;

mockBrowser.runtime.onMessage = {
  removeListener: (listener: Listener) => {
    listeners = listeners.filter(l => l !== listener);
  },
  hasListener: (listener: Listener) => listeners.includes(listener),
  hasListeners: () => listeners.length > 0,
  addListener: (listener: Listener) => {
    listeners = [...listeners, listener];
  },
};

export default mockBrowser;
