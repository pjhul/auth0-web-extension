/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var browserPolyfill = {exports: {}};

(function (module, exports) {
(function (global, factory) {
  {
    factory(module);
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : commonjsGlobal, function (module) {

  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      });

      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */


        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {}
          /* wrappers */
          , {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      }); // Keep track if the deprecation warning has been logged at least once.

      let loggedSendResponseDeprecationWarning = false;
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }

              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    if (typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) {
      throw new Error("This script should only be loaded in a browser extension.");
    } // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.


    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});

}(browserPolyfill));

var browser$1 = browserPolyfill.exports;

var getCrypto = function () {
    // FIXME: window is not accessible in background script
    //ie 11.x uses msCrypto
    return (crypto || window.msCrypto);
};
var getCryptoSubtle = function () {
    var crypto = getCrypto();
    //safari 10.x uses webkitSubtle
    return crypto.subtle || crypto.webkitSubtle;
};
var createRandomString = function () {
    var charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
    var random = "";
    var randomValues = Array.from(getCrypto().getRandomValues(new Uint8Array(43)));
    randomValues.forEach(function (v) { return (random += charset[v % charset.length]); });
    return random;
};
var encode = function (value) { return btoa(value); };
var decode$1 = function (value) { return atob(value); };
var createQueryParams = function (params) {
    return Object.keys(params)
        .filter(function (k) { return typeof params[k] !== "undefined"; })
        .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); })
        .join("&");
};
var sha256 = function (s) { return __awaiter(void 0, void 0, void 0, function () {
    var digestOp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                digestOp = getCryptoSubtle().digest({ name: "SHA-256" }, new TextEncoder().encode(s));
                return [3 /*break*/, 1]; /*(window as any)?.msCrypto*/
            case 1: return [4 /*yield*/, digestOp];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var urlEncodeB64 = function (input) {
    var b64Chars = { "+": "-", "/": "_", "=": "" };
    return input.replace(/[+/=]/g, function (m) { return b64Chars[m]; });
};
// https://stackoverflow.com/questions/30106476/
var decodeB64 = function (input) {
    return decodeURIComponent(decode$1(input)
        .split("")
        .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    })
        .join(""));
};
var urlDecodeB64 = function (input) {
    return decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));
};
var bufferToBase64UrlEncoded = function (input) {
    var ie11SafeInput = new Uint8Array(input);
    return urlEncodeB64(encode(String.fromCharCode.apply(String, Array.from(ie11SafeInput))));
};

var DEFAULT_SCOPE = "openid profile email";
var CACHE_LOCATION_MEMORY = "memory";
var DEFAULT_FETCH_TIMEOUT_MS = 10000;
var DEFAULT_SILENT_TOKEN_RETRY_COUNT = 3;
var DEFAULT_NOW_PROVIDER = function () { return Date.now(); };

/**
 * For context on the istanbul ignore statements below, see:
 * https://github.com/gotwarlost/istanbul/issues/690
 */
/**
 * Thrown when network requests to the Auth server fail.
 */
var GenericError = /** @class */ (function (_super) {
    __extends(GenericError, _super);
    function GenericError(error, error_description) {
        var _this = _super.call(this, error_description) || this;
        _this.error = error;
        _this.error_description = error_description;
        Object.setPrototypeOf(_this, GenericError.prototype);
        return _this;
    }
    GenericError.fromPayload = function (_a) {
        var error = _a.error, error_description = _a.error_description;
        return new GenericError(error, error_description);
    };
    return GenericError;
}(Error));
/**
 * Thrown when handling the redirect callback fails, will be one of Auth0's
 * Authentication API's Standard Error Responses: https://auth0.com/docs/api/authentication?javascript#standard-error-responses
 */
/** @class */ ((function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(error, error_description, state, appState) {
        if (appState === void 0) { appState = null; }
        var _this = _super.call(this, error, error_description) || this;
        _this.state = state;
        _this.appState = appState;
        //https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(_this, AuthenticationError.prototype);
        return _this;
    }
    return AuthenticationError;
})(GenericError));
/**
 * Thrown when silent auth times out (usually due to a configuration issue) or
 * when network requests to the Auth server timeout.
 */
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError() {
        var _this = _super.call(this, 'timeout', 'Timeout') || this;
        //https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(_this, TimeoutError.prototype);
        return _this;
    }
    return TimeoutError;
}(GenericError));
/**
 * Error thrown when the token exchange results in a `mfa_required` error
 */
var MfaRequiredError = /** @class */ (function (_super) {
    __extends(MfaRequiredError, _super);
    function MfaRequiredError(error, error_description, mfa_token) {
        var _this = _super.call(this, error, error_description) || this;
        _this.mfa_token = mfa_token;
        //https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(_this, MfaRequiredError.prototype);
        return _this;
    }
    return MfaRequiredError;
}(GenericError));

var createAbortController = function () { return new AbortController(); };
var dofetch = function (fetchUrl, fetchOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch(fetchUrl, fetchOptions)];
            case 1:
                response = _b.sent();
                _a = {
                    ok: response.ok
                };
                return [4 /*yield*/, response.json()];
            case 2: return [2 /*return*/, (_a.json = _b.sent(),
                    _a)];
        }
    });
}); };
// Removed switch fetch as there's no need to fetch from a worker as we are already in a service worker
var fetchWithTimeout = function (fetchUrl, fetchOptions, timeout) {
    if (timeout === void 0) { timeout = DEFAULT_FETCH_TIMEOUT_MS; }
    return __awaiter(void 0, void 0, void 0, function () {
        var controller, timeoutId;
        return __generator(this, function (_a) {
            controller = createAbortController();
            fetchOptions.signal = controller.signal;
            // The promise will resolve with one of these two promises (the fetch or the timeout), whichever completes first.
            return [2 /*return*/, Promise.race([
                    dofetch(fetchUrl, fetchOptions),
                    new Promise(function (_, reject) {
                        timeoutId = setTimeout(function () {
                            controller.abort();
                            reject(new Error("Timeout when executing 'fetch'"));
                        }, timeout);
                    })
                ]).finally(function () {
                    clearTimeout(timeoutId);
                })];
        });
    });
};
function fetchJSON(url, options, timeout) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchError, response, i, e_1, _a, error, error_description, data, ok, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fetchError = null;
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < DEFAULT_SILENT_TOKEN_RETRY_COUNT)) return [3 /*break*/, 6];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetchWithTimeout(url, options, timeout)];
                case 3:
                    response = _b.sent();
                    fetchError = null;
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _b.sent();
                    // Fetch only fails in the case of a network issue, so should be
                    // retried here. Failure status (4xx, 5xx, etc) return a resolved Promise
                    // with the failure in the body.
                    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
                    fetchError = e_1;
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (fetchError) {
                        // unfetch uses XMLHttpRequest under the hood which throws
                        // ProgressEvents on error, which don't have message properties
                        fetchError.message = fetchError.message || 'Failed to fetch';
                        throw fetchError;
                    }
                    _a = response.json, error = _a.error, error_description = _a.error_description, data = __rest(_a, ["error", "error_description"]), ok = response.ok;
                    if (!ok) {
                        errorMessage = error_description || "HTTP error. Unable to fetch ".concat(url);
                        if (error === 'mfa_required') {
                            throw new MfaRequiredError(error, errorMessage, data.mfa_token);
                        }
                        throw new GenericError(error || 'request_error', errorMessage);
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}

function oauthToken(_a) {
    var baseUrl = _a.baseUrl, timeout = _a.timeout; _a.audience; _a.scope; _a.auth0Client; var useFormData = _a.useFormData, options = __rest(_a, ["baseUrl", "timeout", "audience", "scope", "auth0Client", "useFormData"]);
    return __awaiter(this, void 0, void 0, function () {
        var body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = useFormData
                        ? createQueryParams(options)
                        : JSON.stringify(options);
                    return [4 /*yield*/, fetchJSON("".concat(baseUrl, "/oauth/token"), {
                            method: 'POST',
                            body: body,
                            headers: {
                                'Content-Type': useFormData
                                    ? 'application/x-www-form-urlencoded'
                                    : 'application/json',
                            }
                        }, timeout)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}

var isNumber = function (n) { return typeof n === 'number'; };
var idTokendecoded = [
    'iss',
    'aud',
    'exp',
    'nbf',
    'iat',
    'jti',
    'azp',
    'nonce',
    'auth_time',
    'at_hash',
    'c_hash',
    'acr',
    'amr',
    'sub_jwk',
    'cnf',
    'sip_from_tag',
    'sip_date',
    'sip_callid',
    'sip_cseq_num',
    'sip_via_branch',
    'orig',
    'dest',
    'mky',
    'events',
    'toe',
    'txn',
    'rph',
    'sid',
    'vot',
    'vtm'
];
var decode = function (token) {
    var parts = token.split('.');
    var header = parts[0], payload = parts[1], signature = parts[2];
    if (parts.length !== 3 || !header || !payload || !signature) {
        throw new Error('ID token could not be decoded');
    }
    var payloadJSON = JSON.parse(urlDecodeB64(payload));
    var claims = { __raw: token };
    var user = {};
    Object.keys(payloadJSON).forEach(function (k) {
        claims[k] = payloadJSON[k];
        if (!idTokendecoded.includes(k)) {
            user[k] = payloadJSON[k];
        }
    });
    return {
        encoded: { header: header, payload: payload, signature: signature },
        header: JSON.parse(urlDecodeB64(header)),
        claims: claims,
        user: user
    };
};
var verifyIdToken = function (options) {
    if (!options.id_token) {
        throw new Error('ID token is required but missing');
    }
    var decoded = decode(options.id_token);
    if (!decoded.claims.iss) {
        throw new Error('Issuer (iss) claim must be a string present in the ID token');
    }
    if (decoded.claims.iss !== options.iss) {
        throw new Error("Issuer (iss) claim mismatch in the ID token; expected \"".concat(options.iss, "\", found \"").concat(decoded.claims.iss, "\""));
    }
    if (!decoded.user.sub) {
        throw new Error('Subject (sub) claim must be a string present in the ID token');
    }
    if (decoded.header.alg !== 'RS256') {
        throw new Error("Signature algorithm of \"".concat(decoded.header.alg, "\" is not supported. Expected the ID token to be signed with \"RS256\"."));
    }
    if (!decoded.claims.aud ||
        !(typeof decoded.claims.aud === 'string' ||
            Array.isArray(decoded.claims.aud))) {
        throw new Error('Audience (aud) claim must be a string or array of strings present in the ID token');
    }
    if (Array.isArray(decoded.claims.aud)) {
        if (!decoded.claims.aud.includes(options.aud)) {
            throw new Error("Audience (aud) claim mismatch in the ID token; expected \"".concat(options.aud, "\" but was not one of \"").concat(decoded.claims.aud.join(', '), "\""));
        }
        if (decoded.claims.aud.length > 1) {
            if (!decoded.claims.azp) {
                throw new Error('Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values');
            }
            if (decoded.claims.azp !== options.aud) {
                throw new Error("Authorized Party (azp) claim mismatch in the ID token; expected \"".concat(options.aud, "\", found \"").concat(decoded.claims.azp, "\""));
            }
        }
    }
    else if (decoded.claims.aud !== options.aud) {
        throw new Error("Audience (aud) claim mismatch in the ID token; expected \"".concat(options.aud, "\" but found \"").concat(decoded.claims.aud, "\""));
    }
    if (options.nonce) {
        if (!decoded.claims.nonce) {
            throw new Error('Nonce (nonce) claim must be a string present in the ID token');
        }
        if (decoded.claims.nonce !== options.nonce) {
            throw new Error("Nonce (nonce) claim mismatch in the ID token; expected \"".concat(options.nonce, "\", found \"").concat(decoded.claims.nonce, "\""));
        }
    }
    if (options.max_age && !isNumber(decoded.claims.auth_time)) {
        throw new Error('Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified');
    }
    /* istanbul ignore next */
    if (!isNumber(decoded.claims.exp)) {
        throw new Error('Expiration Time (exp) claim must be a number present in the ID token');
    }
    if (!isNumber(decoded.claims.iat)) {
        throw new Error('Issued At (iat) claim must be a number present in the ID token');
    }
    var leeway = options.leeway || 60;
    var now = new Date(options.now || Date.now());
    var expDate = new Date(0);
    var nbfDate = new Date(0);
    var authTimeDate = new Date(0);
    authTimeDate.setUTCSeconds(parseInt(decoded.claims.auth_time) + options.max_age + leeway);
    expDate.setUTCSeconds(decoded.claims.exp + leeway);
    nbfDate.setUTCSeconds(decoded.claims.nbf - leeway);
    if (now > expDate) {
        throw new Error("Expiration Time (exp) claim error in the ID token; current time (".concat(now, ") is after expiration time (").concat(expDate, ")"));
    }
    if (isNumber(decoded.claims.nbf) && now < nbfDate) {
        throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Currrent time (".concat(now, ") is before ").concat(nbfDate));
    }
    if (isNumber(decoded.claims.auth_time) && now > authTimeDate) {
        throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Currrent time (".concat(now, ") is after last auth at ").concat(authTimeDate));
    }
    if (options.organizationId) {
        if (!decoded.claims.org_id) {
            throw new Error('Organization ID (org_id) claim must be a string present in the ID token');
        }
        else if (options.organizationId !== decoded.claims.org_id) {
            throw new Error("Organization ID (org_id) claim mismatch in the ID token; expected \"".concat(options.organizationId, "\", found \"").concat(decoded.claims.org_id, "\""));
        }
    }
    return decoded;
};

var InMemoryCache = /** @class */ (function () {
    function InMemoryCache() {
        this.enclosedCache = (function () {
            var cache = {};
            return {
                set: function (key, entry) {
                    cache[key] = entry;
                },
                get: function (key) {
                    var cacheEntry = cache[key];
                    if (!cacheEntry) {
                        return null;
                    }
                    return cacheEntry;
                },
                remove: function (key) {
                    delete cache[key];
                },
                allKeys: function () {
                    return Object.keys(cache);
                }
            };
        })();
    }
    return InMemoryCache;
}());

var CACHE_KEY_PREFIX = '@@auth0webext@@';
var CacheKey = /** @class */ (function () {
    function CacheKey(data, prefix) {
        if (prefix === void 0) { prefix = CACHE_KEY_PREFIX; }
        this.prefix = prefix;
        this.client_id = data.client_id;
        this.scope = data.scope;
        this.audience = data.audience;
    }
    /**
     * Converts this `CacheKey` instance into a string for use in a cache
     * @returns A string representation of the key
     */
    CacheKey.prototype.toKey = function () {
        return "".concat(this.prefix, "::").concat(this.client_id, "::").concat(this.audience, "::").concat(this.scope);
    };
    /**
     * Converts a cache key string into a `CacheKey` instance.
     * @param key The key to convert
     * @returns An instance of `CacheKey`
     */
    CacheKey.fromKey = function (key) {
        var _a = key.split('::'), prefix = _a[0], client_id = _a[1], audience = _a[2], scope = _a[3];
        if (!prefix || !client_id || !scope || !audience)
            return null;
        return new CacheKey({ client_id: client_id, scope: scope, audience: audience }, prefix);
    };
    /**
     * Utility function to build a `CacheKey` instance from a cache entry
     * @param entry The entry
     * @returns An instance of `CacheKey`
     */
    CacheKey.fromCacheEntry = function (entry) {
        var scope = entry.scope, audience = entry.audience, client_id = entry.client_id;
        return new CacheKey({
            scope: scope,
            audience: audience,
            client_id: client_id
        });
    };
    return CacheKey;
}());

var DEFAULT_EXPIRY_ADJUSTMENT_SECONDS = 0;
var CacheManager = /** @class */ (function () {
    function CacheManager(cache, keyManifest, nowProvider) {
        this.cache = cache;
        if (keyManifest) {
            this.keyManifest = keyManifest;
        }
        this.nowProvider = nowProvider || DEFAULT_NOW_PROVIDER;
    }
    CacheManager.prototype.get = function (cacheKey, expiryAdjustmentSeconds) {
        var _a;
        if (expiryAdjustmentSeconds === void 0) { expiryAdjustmentSeconds = DEFAULT_EXPIRY_ADJUSTMENT_SECONDS; }
        return __awaiter(this, void 0, void 0, function () {
            var wrappedEntry, keys, matchedKey, now, nowSeconds;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.cache.get(cacheKey.toKey())];
                    case 1:
                        wrappedEntry = _b.sent();
                        if (!!wrappedEntry) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCacheKeys()];
                    case 2:
                        keys = _b.sent();
                        if (!keys)
                            return [2 /*return*/];
                        matchedKey = this.matchExistingCacheKey(cacheKey, keys);
                        if (!matchedKey)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.cache.get(matchedKey)];
                    case 3:
                        wrappedEntry = _b.sent();
                        _b.label = 4;
                    case 4:
                        // If we still don't have an entry, exit.
                        if (!wrappedEntry) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.nowProvider()];
                    case 5:
                        now = _b.sent();
                        nowSeconds = Math.floor(now / 1000);
                        if (!(wrappedEntry.expiresAt - expiryAdjustmentSeconds < nowSeconds)) return [3 /*break*/, 10];
                        if (!wrappedEntry.body.refresh_token) return [3 /*break*/, 7];
                        wrappedEntry.body = {
                            refresh_token: wrappedEntry.body.refresh_token
                        };
                        return [4 /*yield*/, this.cache.set(cacheKey.toKey(), wrappedEntry)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, wrappedEntry.body];
                    case 7: return [4 /*yield*/, this.cache.remove(cacheKey.toKey())];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, ((_a = this.keyManifest) === null || _a === void 0 ? void 0 : _a.remove(cacheKey.toKey()))];
                    case 9:
                        _b.sent();
                        return [2 /*return*/];
                    case 10: return [2 /*return*/, wrappedEntry.body];
                }
            });
        });
    };
    CacheManager.prototype.set = function (entry) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, wrappedEntry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cacheKey = new CacheKey({
                            client_id: entry.client_id,
                            scope: entry.scope,
                            audience: entry.audience
                        });
                        return [4 /*yield*/, this.wrapCacheEntry(entry)];
                    case 1:
                        wrappedEntry = _b.sent();
                        return [4 /*yield*/, this.cache.set(cacheKey.toKey(), wrappedEntry)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, ((_a = this.keyManifest) === null || _a === void 0 ? void 0 : _a.add(cacheKey.toKey()))];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheManager.prototype.clear = function (clientId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getCacheKeys()];
                    case 1:
                        keys = _b.sent();
                        if (!keys)
                            return [2 /*return*/];
                        return [4 /*yield*/, keys
                                .filter(function (key) { return (clientId ? key.includes(clientId) : true); })
                                .reduce(function (memo, key) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, memo];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, this.cache.remove(key)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, Promise.resolve())];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, ((_a = this.keyManifest) === null || _a === void 0 ? void 0 : _a.clear())];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Note: only call this if you're sure one of our internal (synchronous) caches are being used.
     */
    CacheManager.prototype.clearSync = function (clientId) {
        var _this = this;
        var _a, _b;
        var keys = (_b = (_a = this.cache).allKeys) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (!keys)
            return;
        keys
            .filter(function (key) { return (clientId ? key.includes(clientId) : true); })
            .forEach(function (key) {
            _this.cache.remove(key);
        });
    };
    CacheManager.prototype.wrapCacheEntry = function (entry) {
        return __awaiter(this, void 0, void 0, function () {
            var now, expiresInTime, expirySeconds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nowProvider()];
                    case 1:
                        now = _a.sent();
                        expiresInTime = Math.floor(now / 1000) + entry.expires_in;
                        expirySeconds = Math.min(expiresInTime, entry.decodedToken.claims.exp || Infinity);
                        return [2 /*return*/, {
                                body: entry,
                                expiresAt: expirySeconds
                            }];
                }
            });
        });
    };
    CacheManager.prototype.getCacheKeys = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var keys, keys;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.keyManifest) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.keyManifest.get()];
                    case 1:
                        keys = ((_c.sent()) || {}).keys;
                        return [2 /*return*/, keys || []];
                    case 2: return [4 /*yield*/, ((_b = (_a = this.cache).allKeys) === null || _b === void 0 ? void 0 : _b.call(_a))];
                    case 3:
                        keys = _c.sent();
                        return [2 /*return*/, keys || []];
                }
            });
        });
    };
    /**
     * Finds the corresponding key in the cache based on the provided cache key.
     * The keys inside the cache are in the format {prefix}::{client_id}::{audience}::{scope}.
     * The first key in the cache that satisfies the following conditions is returned
     *  - `prefix` is strict equal to Auth0's internally configured `keyPrefix`
     *  - `client_id` is strict equal to the `cacheKey.client_id`
     *  - `audience` is strict equal to the `cacheKey.audience`
     *  - `scope` contains at least all the `cacheKey.scope` values
     *  *
     * @param keyToMatch The provided cache key
     * @param allKeys A list of existing cache keys
     */
    CacheManager.prototype.matchExistingCacheKey = function (keyToMatch, allKeys) {
        return allKeys.filter(function (key) {
            var cacheKey = CacheKey.fromKey(key);
            var scopeSet = new Set((cacheKey === null || cacheKey === void 0 ? void 0 : cacheKey.scope) && cacheKey.scope.split(' '));
            var scopesToMatch = keyToMatch.scope.split(' ');
            var hasAllScopes = (cacheKey === null || cacheKey === void 0 ? void 0 : cacheKey.scope) &&
                scopesToMatch.reduce(function (acc, current) { return acc && scopeSet.has(current); }, true);
            return ((cacheKey === null || cacheKey === void 0 ? void 0 : cacheKey.prefix) === CACHE_KEY_PREFIX &&
                cacheKey.client_id === keyToMatch.client_id &&
                cacheKey.audience === keyToMatch.audience &&
                hasAllScopes);
        })[0];
    };
    return CacheManager;
}());

var CacheKeyManifest = /** @class */ (function () {
    function CacheKeyManifest(cache, clientId) {
        this.cache = cache;
        this.clientId = clientId;
        this.manifestKey = this.createManifestKeyFrom(this.clientId);
    }
    CacheKeyManifest.prototype.add = function (key) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var keys, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = Set.bind;
                        return [4 /*yield*/, this.cache.get(this.manifestKey)];
                    case 1:
                        keys = new (_b.apply(Set, [void 0, ((_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.keys) || []]))();
                        keys.add(key);
                        return [4 /*yield*/, this.cache.set(this.manifestKey, {
                                keys: Array.from(keys.values()),
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CacheKeyManifest.prototype.remove = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.get(this.manifestKey)];
                    case 1:
                        entry = _a.sent();
                        if (!entry) return [3 /*break*/, 5];
                        keys = new Set(entry.keys);
                        keys.delete(key);
                        if (!(keys.size > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cache.set(this.manifestKey, { keys: Array.from(keys.values()) })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.cache.remove(this.manifestKey)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CacheKeyManifest.prototype.get = function () {
        return this.cache.get(this.manifestKey);
    };
    CacheKeyManifest.prototype.clear = function () {
        return this.cache.remove(this.manifestKey);
    };
    CacheKeyManifest.prototype.createManifestKeyFrom = function (clientId) {
        return "".concat(CACHE_KEY_PREFIX, "::").concat(clientId);
    };
    return CacheKeyManifest;
}());

var _a;
/**
 * Auth0 SDK for Background Scripts in a Web Extension
 */
var Auth0Client = /** @class */ (function () {
    function Auth0Client(options) {
        // TODO: validate crypto library
        // TODO: find a way to validate we are running in a background script
        var _a, _b;
        this.options = options;
        if (options.cache && options.cacheLocation) {
            console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`.");
        }
        var cache;
        if (options.cache) {
            cache = options.cache;
            this.cacheLocation = null;
        }
        else {
            this.cacheLocation = options.cacheLocation || CACHE_LOCATION_MEMORY;
            var factory = cacheFactory(this.cacheLocation);
            if (!factory) {
                throw new Error("Invalid cache location \"".concat(this.cacheLocation, "\""));
            }
            cache = factory();
        }
        this.scope = this.options.scope;
        this.nowProvider = this.options.nowProvider || DEFAULT_NOW_PROVIDER;
        this.cacheManager = new CacheManager(cache, !cache.allKeys
            ? new CacheKeyManifest(cache, this.options.client_id)
            : null, this.nowProvider);
        this.domainUrl = getDomain(this.options.domain);
        this.tokenIssuer = getTokenIssuer(this.options.issuer, this.domainUrl);
        this.defaultScope = getUniqueScopes("openid", ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.advancedOptions) === null || _b === void 0 ? void 0 : _b.defaultScope) || DEFAULT_SCOPE);
        if (this.options.useRefreshTokens) ;
        this.customOptions = getCustomInitialOptions(options);
    }
    Auth0Client.prototype._url = function (path) {
        // TODO: Not sure if we should include the auth0Client param or not?
        return "".concat(this.domainUrl).concat(path);
    };
    Auth0Client.prototype._getParams = function (authorizeOptions, state, nonce, code_challenge, redirect_uri) {
        // These options should be excluded from the authorize URL,
        // as they"re options for the client and not for the IdP.
        // ** IMPORTANT ** If adding a new client option, include it in this destructure list.
        var _a = this.options; _a.useRefreshTokens; _a.useCookiesForTransactions; _a.useFormData; _a.auth0Client; _a.cacheLocation; _a.advancedOptions; _a.detailedResponse; _a.nowProvider; _a.authorizeTimeoutInSeconds; _a.legacySameSiteCookie; _a.sessionCheckExpiryDays; _a.domain; _a.leeway; var loginOptions = __rest(_a, ["useRefreshTokens", "useCookiesForTransactions", "useFormData", "auth0Client", "cacheLocation", "advancedOptions", "detailedResponse", "nowProvider", "authorizeTimeoutInSeconds", "legacySameSiteCookie", "sessionCheckExpiryDays", "domain", "leeway"]);
        return __assign(__assign(__assign({}, loginOptions), authorizeOptions), { scope: getUniqueScopes(this.defaultScope, this.scope, authorizeOptions.scope), response_type: "code", response_mode: "query", state: state, nonce: nonce, redirect_uri: redirect_uri || this.options.redirect_uri, code_challenge: code_challenge, code_challenge_method: "S256" });
    };
    Auth0Client.prototype._authorizeUrl = function (authorizeOptions) {
        return this._url("/authorize?".concat(createQueryParams(authorizeOptions)));
    };
    // TODO: Return verbose response if detailedResponse = true
    /**
     * Fetches a new access token
     *
     * ```js
     * const token = await auth0.getTokenSilently(options);
     * ```
     *
     * Refresh tokens are currently not supported
     */
    Auth0Client.prototype.getTokenSilently = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getTokenSilently(__assign(__assign({ audience: this.options.audience, ignoreCache: false }, options), { scope: getUniqueScopes(this.defaultScope, this.scope, options.scope) }))];
                    case 1: 
                    // FIXME: Should use keyed singlePromise like is auth0-spa-js
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Auth0Client.prototype._getTokenSilently = function (options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var ignoreCache, getTokenOptions, entry, authResult, _a, id_token, access_token, oauthTokenScope, expires_in;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ignoreCache = options.ignoreCache, getTokenOptions = __rest(options, ["ignoreCache"]);
                        console.log("getTokenSilently");
                        if (!(!ignoreCache && getTokenOptions.scope)) return [3 /*break*/, 2];
                        console.log("pulling token from cache");
                        return [4 /*yield*/, this._getEntryFromCache({
                                scope: getTokenOptions.scope,
                                audience: getTokenOptions.audience || "default",
                                client_id: this.options.client_id,
                                getDetailedEntry: options.detailedResponse,
                            })];
                    case 1:
                        entry = _b.sent();
                        if (entry) {
                            return [2 /*return*/, entry];
                        }
                        _b.label = 2;
                    case 2:
                        if (!this.options.useRefreshTokens) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._getTokenUsingRefreshToken(getTokenOptions)];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this._getTokenFromIfFrame(getTokenOptions)];
                    case 5:
                        _a = _b.sent();
                        _b.label = 6;
                    case 6:
                        authResult = _a;
                        console.log("storing token in cache");
                        return [4 /*yield*/, this.cacheManager.set(__assign({ client_id: this.options.client_id }, authResult))
                            // TODO: Save to cookies
                        ];
                    case 7:
                        _b.sent();
                        // TODO: Save to cookies
                        if (options.detailedResponse) {
                            id_token = authResult.id_token, access_token = authResult.access_token, oauthTokenScope = authResult.oauthTokenScope, expires_in = authResult.expires_in;
                            return [2 /*return*/, __assign(__assign({ id_token: id_token, access_token: access_token }, (oauthTokenScope ? { scope: oauthTokenScope } : null)), { expires_in: expires_in })];
                        }
                        return [2 /*return*/, authResult.access_token];
                }
            });
        });
    };
    Auth0Client.prototype._getTokenUsingRefreshToken = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw "We currently don't support using refresh tokens, set useRefreshTokens to false";
            });
        });
    };
    Auth0Client.prototype._getTokenFromIfFrame = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var stateIn, nonceIn, code_verifier, code_challengeBuffer, code_challenge, params, url, queryOptions, currentTab_1, codeResult, scope, audience, customOptions, tokenResult, decodedToken, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stateIn = encode(createRandomString());
                        nonceIn = encode(createRandomString());
                        code_verifier = createRandomString();
                        return [4 /*yield*/, sha256(code_verifier)];
                    case 1:
                        code_challengeBuffer = _a.sent();
                        code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);
                        params = this._getParams(options, stateIn, nonceIn, code_challenge, options.redirect_uri || this.options.redirect_uri);
                        url = this._authorizeUrl(__assign(__assign({}, params), { prompt: "none", response_mode: "web_message" }));
                        console.log("using authorize url: ".concat(url));
                        options.timeoutInSeconds || this.options.authorizeTimeoutInSeconds;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 7, , 8]);
                        queryOptions = { active: true, currentWindow: true };
                        return [4 /*yield*/, browser$1.tabs.query(queryOptions)];
                    case 3:
                        currentTab_1 = (_a.sent())[0];
                        console.log("current tab id: ".concat(currentTab_1 === null || currentTab_1 === void 0 ? void 0 : currentTab_1.id));
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                if (!(currentTab_1 === null || currentTab_1 === void 0 ? void 0 : currentTab_1.id)) {
                                    throw "Could not access current tab. Do you have the 'activeTab' permission in your manifest?";
                                }
                                var parentPort = browser$1.tabs.connect(currentTab_1.id, { name: "parent" });
                                console.log("connecting to content script in tab ".concat(currentTab_1.id));
                                var handler = function (childPort) {
                                    console.log("child iframe connected from iframe");
                                    childPort.onMessage.addListener(function (message) {
                                        console.log("received final message ".concat(JSON.stringify(message)));
                                        resolve(message);
                                        childPort.disconnect();
                                        parentPort.disconnect();
                                        console.log("disconnecting and removing handlers");
                                        browser$1.runtime.onConnect.removeListener(handler);
                                    });
                                    console.log("sending authorize url");
                                    childPort.postMessage({
                                        authorizeUrl: url,
                                        domainUrl: _this.domainUrl,
                                    });
                                };
                                browser$1.runtime.onConnect.addListener(handler);
                                console.log("sending redirectUri to parent iframe");
                                parentPort.postMessage({
                                    redirectUri: params.redirect_uri,
                                });
                            })];
                    case 4:
                        codeResult = _a.sent();
                        if (stateIn !== codeResult.state) {
                            throw new Error("Invalid state");
                        }
                        scope = options.scope, audience = options.audience, customOptions = __rest(options, ["scope", "redirect_uri", "audience", "ignoreCache", "timeoutInSeconds", "detailedResponse"]);
                        console.log("getting access_token with code");
                        return [4 /*yield*/, oauthToken(__assign(__assign(__assign({}, this.customOptions), customOptions), { scope: scope, audience: audience, baseUrl: this.domainUrl, client_id: this.options.client_id, code_verifier: code_verifier, code: codeResult.code, grant_type: "authorization_code", redirect_uri: params.redirect_uri, useFormData: this.options.useFormData, auth0Client: {} }))];
                    case 5:
                        tokenResult = _a.sent();
                        return [4 /*yield*/, this._verifyIdToken(tokenResult.id_token, nonceIn)];
                    case 6:
                        decodedToken = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, tokenResult), { decodedToken: decodedToken, scope: params.scope, oauthTokenScope: tokenResult.scope, audience: params.audience || "default" })];
                    case 7:
                        e_1 = _a.sent();
                        if (e_1.error === "login_required") ;
                        throw e_1;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Auth0Client.prototype._verifyIdToken = function (id_token, nonce, organizationId) {
        return __awaiter(this, void 0, void 0, function () {
            var now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nowProvider()];
                    case 1:
                        now = _a.sent();
                        return [2 /*return*/, verifyIdToken({
                                iss: this.tokenIssuer,
                                aud: this.options.client_id,
                                id_token: id_token,
                                nonce: nonce,
                                organizationId: organizationId,
                                leeway: this.options.leeway,
                                max_age: parseNumber(this.options.max_age),
                                now: now,
                            })];
                }
            });
        });
    };
    Auth0Client.prototype._getEntryFromCache = function (_a) {
        var scope = _a.scope, audience = _a.audience, client_id = _a.client_id, _b = _a.getDetailedEntry, getDetailedEntry = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            var entry, id_token, access_token, oauthTokenScope, expires_in;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.cacheManager.get(new CacheKey({
                            scope: scope,
                            audience: audience,
                            client_id: client_id,
                        }), 60)];
                    case 1:
                        entry = _c.sent();
                        if (entry && entry.access_token) {
                            if (getDetailedEntry) {
                                id_token = entry.id_token, access_token = entry.access_token, oauthTokenScope = entry.oauthTokenScope, expires_in = entry.expires_in;
                                if (!id_token || !expires_in) {
                                    return [2 /*return*/, undefined];
                                }
                                return [2 /*return*/, __assign(__assign({ id_token: id_token, access_token: access_token }, (oauthTokenScope ? { scope: oauthTokenScope } : null)), { expires_in: expires_in })];
                            }
                            else {
                                return [2 /*return*/, entry.access_token];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Auth0Client;
}());
var parseNumber = function (value) {
    if (typeof value !== "string") {
        return value;
    }
    else {
        return parseInt(value, 10) || undefined;
    }
};
var getDomain = function (domainUrl) {
    if (!/^https?:\/\//.test(domainUrl)) {
        return "https://".concat(domainUrl);
    }
    else {
        return domainUrl;
    }
};
var cacheLocationBuilders = (_a = {},
    _a[CACHE_LOCATION_MEMORY] = function () { return new InMemoryCache().enclosedCache; },
    _a);
var cacheFactory = function (location) {
    return cacheLocationBuilders[location];
};
var getTokenIssuer = function (issuer, domainUrl) {
    if (issuer) {
        return issuer.startsWith("https://") ? issuer : "https://".concat(issuer, "/");
    }
    else {
        return "".concat(domainUrl, "/");
    }
};
var dedupe = function (arr) { return Array.from(new Set(arr)); };
var getUniqueScopes = function () {
    var scopes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        scopes[_i] = arguments[_i];
    }
    return dedupe(scopes.filter(Boolean).join(" ").trim().split(/\s+/)).join(" ");
};
var getCustomInitialOptions = function (options) {
    options.advancedOptions; options.audience; options.auth0Client; options.authorizeTimeoutInSeconds; options.cacheLocation; options.client_id; options.domain; options.issuer; options.leeway; options.max_age; options.redirect_uri; options.scope; options.useRefreshTokens; options.useCookiesForTransactions; options.useFormData; var customParams = __rest(options, ["advancedOptions", "audience", "auth0Client", "authorizeTimeoutInSeconds", "cacheLocation", "client_id", "domain", "issuer", "leeway", "max_age", "redirect_uri", "scope", "useRefreshTokens", "useCookiesForTransactions", "useFormData"]);
    return customParams;
};

// We can probably pull redirectUri from background script at some point
function handleTokenRequest(redirectUri) {
    var _this = this;
    if (window.location.origin === redirectUri) {
        console.log("content script running in child iframe, connecting to background");
        var port_1 = browser$1.runtime.connect();
        var handler = function (message) { return __awaiter(_this, void 0, void 0, function () {
            var authorizeUrl, domainUrl, codeResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authorizeUrl = message.authorizeUrl, domainUrl = message.domainUrl;
                        console.log("received message ".concat(JSON.stringify(message)));
                        return [4 /*yield*/, runIFrame(authorizeUrl, domainUrl, 60)];
                    case 1:
                        codeResult = _a.sent();
                        console.log("returning code");
                        port_1.postMessage(codeResult);
                        return [2 /*return*/];
                }
            });
        }); };
        port_1.onMessage.addListener(handler);
    }
    else {
        browser$1.runtime.onConnect.addListener(function (port) {
            var handler = function () {
                console.log("creating parent iframe");
                var iframe = document.createElement("iframe");
                iframe.setAttribute("width", "0");
                iframe.setAttribute("height", "0");
                iframe.style.display = "none";
                document.body.appendChild(iframe);
                iframe.setAttribute("src", redirectUri);
                port.onMessage.removeListener(handler);
                port.onDisconnect.addListener(function () {
                    console.log("removing parent iframe");
                    window.document.body.removeChild(iframe);
                });
            };
            port.onMessage.addListener(handler);
        });
    }
}
var runIFrame = function (authorizeUrl, eventOrigin, timeoutInSeconds) {
    if (timeoutInSeconds === void 0) { timeoutInSeconds = 60; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res, rej) {
                    var iframe = window.document.createElement("iframe");
                    iframe.setAttribute("width", "0");
                    iframe.setAttribute("height", "0");
                    iframe.style.display = "none";
                    var removeIframe = function () {
                        if (window.document.body.contains(iframe)) {
                            window.document.body.removeChild(iframe);
                            window.removeEventListener("message", iframeEventHandler, false);
                        }
                    };
                    var iframeEventHandler;
                    var timeoutSetTimeoutId = setTimeout(function () {
                        rej(new TimeoutError());
                        removeIframe();
                    }, timeoutInSeconds * 1000);
                    iframeEventHandler = function (e) {
                        if (e.origin != eventOrigin)
                            return;
                        if (!e.data || e.data.type !== "authorization_response")
                            return;
                        var eventSource = e.source;
                        if (eventSource) {
                            eventSource.close();
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
                })];
        });
    });
};

/* async */ function createAuth0Client(options) {
    var auth0 = new Auth0Client(options);
    // TODO: run auth0.checkSession();
    return auth0;
}

export { Auth0Client, createAuth0Client as default, handleTokenRequest };
//# sourceMappingURL=auth0-web-extension.production.esm.js.map
