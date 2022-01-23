# auth0-web-extension

## Installation

Using [npm](https://npmjs.org)

```sh
npm install https://github.com/pjhul/auth0-web-extension
```

Using [yarn](https://yarnpkg.com)

```sh
yarn add auth0-web-extension@https://github.com/pjhul/auth0-web-extension
```

## Create the token handler

Create a new js file in your project called handler.js with the following contents:

```js
import { handleTokenRequest } from "auth0-web-extension"
handleTokenRequest(<YOUR_REDIRECT_URI>);
```

**Make sure this file is built and output into its own separate chunk, e.g. build/js/callback.js**

## Permissions

In your manifest, you will need to add a couple items. It is important to make sure that this new content script gets injected on all the same pages your current content scripts do.

```jsonc
{
  /* ... */
  "content_scripts": [
    {
      "matches": [
        "<YOUR_REDIRECT_URI>" // Make sure your redirect url is included
      ],
      "all_frames": true, // All frames must be set to true
      "js": ["...", "<PATH_TO_HANDLER_JS>"] // This should be the path to the build output of the file (handler.js) we created in the last step
    }
  ]
}
```

## Initializing the client

In your background script, create an `Auth0Client` instance

```js
import createAuth0Client from "auth0-web-extension"

const auth0 = createAuth0Client({
  domain: '<AUTH0_DOMAIN>',
  client_id: '<AUTH0_CLIENT_ID>',
  redirect_uri: '<YOUR_REDIRECT_URI>',
});
```

## Get an access token

Now, all you need to do to get an access token, is to call `getTokenSilently`

```js
const token = await auth0.getTokenSilently(options);
```

## Caveats

1. We don't yet support refresh tokens, but again this should be coming soon.
2. This package is not on npm yet, but after some of these other caveats are fixed I'll make it available.

## Support + Feedback

For support or to provide feedback, please [raise an issue on the issue tracker](https://github.com/pjhul/auth0-web-extension/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/pjhul/auth0-web-extension/blob/main/LICENSE) file for more info.
