export const getCrypto = () => {
  // FIXME: window is not accessible in background script
  //ie 11.x uses msCrypto
  return (crypto || (window as any).msCrypto) as Crypto;
};

export const getCryptoSubtle = () => {
  const crypto = getCrypto();
  //safari 10.x uses webkitSubtle
  return crypto.subtle || (crypto as any).webkitSubtle;
};

export const createRandomString = (length: number): string => {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";

  let random = "";

  for(let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * charset.length);
    random += charset[idx];
  }

  return random;
}

export const createSecureRandomString = () => {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";

  let random = "";

  const randomValues = Array.from(
    getCrypto().getRandomValues(new Uint8Array(43))
  );

  randomValues.forEach(v => (random += charset[v % charset.length]));

  return random;
};

export const encode = (value: string) => btoa(value);
export const decode = (value: string) => atob(value);

export const createQueryParams = (params: any) => {
  return Object.keys(params)
    .filter(k => typeof params[k] !== "undefined")
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};

export const sha256 = async (s: string) => {
  const digestOp: any = getCryptoSubtle().digest(
    { name: "SHA-256" },
    new TextEncoder().encode(s)
  );

  // msCrypto (IE11) uses the old spec, which is not Promise based
  // https://msdn.microsoft.com/en-us/expression/dn904640(v=vs.71)
  // Instead of returning a promise, it returns a CryptoOperation
  // with a result property in it.
  // As a result, the various events need to be handled in the event that we"re
  // working in IE11 (hence the msCrypto check). These events just call resolve
  // or reject depending on their intention.
  if(false /*(window as any)?.msCrypto*/) {
    return new Promise((res, rej) => {
      digestOp.oncomplete = (e: any) => {
        res(e.target.result);
      };

      digestOp.onerror = (e: ErrorEvent) => {
        rej(e.error);
      };

      digestOp.onabort = () => {
        rej("The digest operation was aborted");
      };
    });
  } else {
    return await digestOp;
  }
};

const urlEncodeB64 = (input: string) => {
  const b64Chars: { [index: string]: string } = { "+": "-", "/": "_", "=": "" };
  return input.replace(/[+/=]/g, (m: string) => b64Chars[m] as string);
};

// https://stackoverflow.com/questions/30106476/
const decodeB64 = (input: string) =>
  decodeURIComponent(
    decode(input)
      .split("")
      .map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

export const urlDecodeB64 = (input: string) =>
  decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));

export const bufferToBase64UrlEncoded = (input: number[] | Uint8Array) => {
  const ie11SafeInput = new Uint8Array(input);
  return urlEncodeB64(
    encode(String.fromCharCode(...Array.from(ie11SafeInput)))
  );
};

export const validateCrypto = () => {
  if (!getCrypto()) {
    throw new Error(
      "For security reasons, `window.crypto` is required to run `auth0-web-extension`."
    );
  }
  if (typeof getCryptoSubtle() === "undefined") {
    throw new Error(`
      auth0-web-extension must run on a secure origin.
    `);
  }
};
