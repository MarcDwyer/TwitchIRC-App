import { useChatterCtx } from "@Chatter/context/chatterctx.tsx";

export function useUserInfo() {
  const { twitchAPI } = useChatterCtx();

  return twitchAPI?.userInfo;
}
