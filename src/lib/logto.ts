import LogtoClient from "@logto/browser";
import { openUrl } from "@tauri-apps/plugin-opener";
import { isTauri } from "./detect-tauri";

export const logtoClient = new LogtoClient({
	endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
	appId: import.meta.env.VITE_LOGTO_APP_ID,
});

if (isTauri) {
	logtoClient.adapter.navigate = (url) => openUrl(url);
}