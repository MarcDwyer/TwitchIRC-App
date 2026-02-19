import { useTwitchReady } from "@/hooks/useTwitchReady";

export function useUserInfo() {
  const { twitchAPI } = useTwitchReady();

  return twitchAPI?.userInfo;
}
