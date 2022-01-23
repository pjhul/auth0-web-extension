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

## Getting Started

To start, go to Auth0 and add the following URLs under these settings in your application:

- **Allowed Callback URLs**: `chrome-extension://<YOUR_EXTENSION_ID>/callback.html`
- **Allowed Web Origins**: `chrome-extension://<YOUR_EXTENSION_ID>/callback.html`

## Create the callback page

Create a new js file in your project called callback.js with the following contents:

```js
import { handleTokenRequest } from "auth0-web-extension"
handleTokenRequest();
```

**Make sure this file is built and output into its own separate chunk, e.g. build/js/callback.js**

In your build/output folder for your extension (wherever your index.html is located) create a new file called callback.html with the following contents

```html
<html>
  <head>
    <script src="<PATH_TO_CALLBACK_JS>"></script>
  </head>

  <body></body>
</html>
```

Here, replace `PATH_TO_CALLBACK_JS` with wherever your callback.js file is output to in your build folder.

## Permissions

In your manifest, you will need to change a couple items:

```jsonc
{
  /* ... */
  "permissions": [
   "scripting" // Add the following permission
  ],
  "host_permissions": [
    "https://*/*" // Add the following host permissions
  ],
  "web_accessible_resources": [
    /* Add the following web accessible resource */
    {
      "resources": ["callback.html"],
      "matches": ["https://*/*"]
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
  redirect_uri: 'chrome-extension://<YOUR_EXTENSION_ID>/callback.html',
});
```

## Get an access token

Now, all you need to do to get an access token, is to call `getTokenSilently`

```js
const token = await auth0.getTokenSilently(options);
```

## Caveats

1. This currently only works with callback URLs of the form `chrome-extension://...`, but this limitation will be removed within the next couple days
2. We don't yet support refresh tokens, but again this should be coming soon.
3. This package is not on npm yet, but after some of these other caveats are fixed I'll make it available.

## Support + Feedback

For support or to provide feedback, please [raise an issue on the issue tracker](https://github.com/pjhul/auth0-web-extension/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/pjhul/auth0-web-extension/blob/main/LICENSE) file for more info.
