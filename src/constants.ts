export const DEFAULT_SCOPE = "openid profile email";

export const PARENT_PORT_NAME = "auth0-web-extension::parent";
export const CHILD_PORT_NAME = "auth0-web-extension::child";

export const CACHE_LOCATION_MEMORY = "memory";

export const RECOVERABLE_ERRORS = [
  'login_required',
  'consent_required',
  'interaction_required',
  'account_selection_required',
  // Strictly speaking the user can't recover from `access_denied` - but they
  // can get more information about their access being denied by logging in
  // interactively.
  'access_denied'
];

export const DEFAULT_FETCH_TIMEOUT_MS = 10000;
export const DEFAULT_SILENT_TOKEN_RETRY_COUNT = 3;

export const DEFAULT_NOW_PROVIDER = () => Date.now();
