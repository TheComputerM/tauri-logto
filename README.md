# Tauri + OAuth2 (Logto)

This repository has a tauri app that works as both native and a plain vanilla web build. Inspect its codebase to learn more. There are two main ways to get OAuth2 working on Tauri.

1) Using Deeplinks, more mobile app like
2) Using a separate server to catch the redirect url, using the oauth-plugin

## Using Deeplinks

### Step 1: Add plugins and dependencies

- [tauri deep linking plugin](https://v2.tauri.app/plugin/deep-linking/)
- [tauri single instacne plugin](https://v2.tauri.app/plugin/single-instance/) - recommened
- [tauri opener plugin](https://v2.tauri.app/plugin/opener/)
- [tauri oauth plugin](https://github.com/FabianLars/tauri-plugin-oauth)
- [@logto/browser](https://www.npmjs.com/package/@logto/browser)

After adding these, make sure you configure these for the platforms of your choosing.

For this example, I am assuming I have registered `tauri-logto://` as a deep link to the app. I recommend dynamically registering the callback url on desktop platforms.

----

### Step 2: Enable withGlobalTauri (optional)

I recommend this step **IF** you want your app to run on the web browser along with being a native app.

```json
// tauri.conf.json
{
  "app": {
    "withGlobalTauri": true,
  }
}
```

```js
export const isTauri = "__TAURI__" in window;
```

----

### Step 3: Create a Logto native application

**Redirect URIs:**

1. tauri-logto://callback
2. http://localhost:1420/callback (for the plain web build)

**Post sign-out redirect URIs:**

1. tauri-logto://callback
2. http://localhost:1420/ (for the plain web build)

----

### Step 4: Patch Logto's redirect

Make sure to use the opener plugin to redirect instead of the tauri webview.

```ts
export const logtoClient = new LogtoClient({
	endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
	appId: import.meta.env.VITE_LOGTO_APP_ID,
});

if (isTauri) {
	logtoClient.adapter.navigate = (url) => openUrl(url);
}
```

----

### Step 5: Handle Login

The fun part. 

```rust
let mut builder = tauri::Builder::default();

#[cfg(desktop)]
{
  builder = builder.plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
    if argv.len() > 1 && argv[1].starts_with("tauri-logto://callback") {
      let redirect_uri = argv[1].clone();
      app.emit("redirect_uri", redirect_uri)
        .expect("failed to emit redirect_uri");
    }
  }));
}

builder
  .plugin(tauri_plugin_opener::init())
  .plugin(tauri_plugin_deep_link::init())
  //...
```

```ts
async function handleTauriLogin() {
  await logtoClient.signIn("tauri-logto://callback");
  const stopListener = await listen<string>(
    "redirect_uri",
    async (event) => {
      await logtoClient.handleSignInCallback(event.payload);
      if (await logtoClient.isAuthenticated()) {
        stopListener?.();
        navigate("/app");
      }
    },
  );
}
```

## Using Tauri Oauth Plugin

### Step 1: Add plugins and dependencies

- [tauri opener plugin](https://v2.tauri.app/plugin/opener/)
- [tauri oauth plugin](https://github.com/FabianLars/tauri-plugin-oauth)
- [@logto/browser](https://www.npmjs.com/package/@logto/browser)

----

### Step 2: Create a Logto native application

**Redirect URIs:**

1. http://localhost (for the server created by the plugin)

**CORS allowed origins:**

1. http://localhost:1420 (for app during dev)
2. tauri://localhost (for app during production)


We need `tauri://localhost` to cors allowed origins because that is the custom protocol used in production, if you want to change that use the [tauri localhost plugin](https://v2.tauri.app/plugin/localhost/).

----

### Step 3: Patch Logto's redirect

Make sure to use the opener plugin to redirect instead of the tauri webview.

```ts
export const logtoClient = new LogtoClient({
	endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
	appId: import.meta.env.VITE_LOGTO_APP_ID,
});

if (isTauri) {
	logtoClient.adapter.navigate = (url) => openUrl(url);
}
```

### Step 4: Handle Login

```ts
import { onUrl, start } from "@fabianlars/tauri-plugin-oauth";
import { logtoClient } from "../lib/logto";

// when the login button is clicked
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