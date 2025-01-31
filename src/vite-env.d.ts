/// <reference types="vite/client" />

import type TauriAPI from '@tauri-apps/api';

declare global {
  interface Window {
    __TAURI__?: typeof TauriAPI;
  }
}