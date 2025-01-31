# Tauri + Logto (OAuth2)

This repository demonstrates how you can setup logto (or any other oidc) authentication in a tauri application.

## Steps

### Install dependencies

We'll need to install and setup the following dependencies.

- [tauri opener plugin](https://v2.tauri.app/plugin/opener/)
- [tauri oauth plugin](https://github.com/FabianLars/tauri-plugin-oauth)
- [@logto/browser](https://www.npmjs.com/package/@logto/browser)

### Patch `@logto/browser` (kinda)

For tauri to open the redirect url in a browser window instead of the app itself, we need to patch logto's navigate function with the opener plugin's.

```ts
import { openUrl } from "@tauri-apps/plugin-opener";

export const logtoClient = new LogtoClient({
	// ...
});

logtoClient.adapter.navigate = (url) => openUrl(url);
```

### Create a Logto native application

Also clone `.env.example` -> `.env` and fill in the details according to your logto application.

- Add a redirect uri to `http://localhost`.
- Add `http://localhost:1420` and `tauri://localhost` to CORS allowed origins.

### Enjoy

You basic sign in flow should look like this, the following is React code.

```ts
import { onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import { logtoClient } from "../lib/logto";

// ...
  async function handleSignin() {
		const port = await start();
		await logtoClient.signIn(`http://localhost:${port}`);

		await onUrl(async (url) => {
			await logtoClient.handleSignInCallback(url);
			if (await logtoClient.isAuthenticated()) {
				alert("Authentication successful!");
        // stop callback server
			} else {
				alert("Authentication failed!");
			}
		});
	}
```


## Notes

- We need `tauri://localhost` to cors allowed origins because that is the custom protocol used in production, if you want to change that use the [tauri localhost plugin](https://v2.tauri.app/plugin/localhost/).