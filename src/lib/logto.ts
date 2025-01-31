import LogtoClient from '@logto/browser';

export const logtoClient = new LogtoClient({
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
});