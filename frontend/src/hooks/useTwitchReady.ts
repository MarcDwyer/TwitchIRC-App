import { useTwitchCtx } from "../context/twitchctx.tsx";

/** Only call this from components that render after the App.tsx null guards */
export const useTwitchReady = () => {
  const ctx = useTwitchCtx();
  if (!ctx.twitchAPI || !ctx.clientID || !ctx.oauth.token) {
    throw new Error("useTwitchReady called before Twitch context is ready");
  }
  return {
    twitchAPI: ctx.twitchAPI,
    clientID: ctx.clientID,
    token: ctx.oauth.token,
  };
};
