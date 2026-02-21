/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_TWITCH_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
