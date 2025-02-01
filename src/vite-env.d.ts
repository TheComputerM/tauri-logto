/// <reference types="vite/client" />

import type * as BaseTauri from "@tauri-apps/api";
import type * as TauriDeepLink from "@tauri-apps/plugin-deep-link";

interface TAURI {
	app: typeof BaseTauri.app;
	event: typeof BaseTauri.event;
	deepLink: typeof TauriDeepLink;
}

declare global {
	interface Window {
		__TAURI__?: TAURI;
	}
}
