import { useCallback, useEffect } from "react";
import { useTwitchCtx } from "../context/twitchctx.tsx";
import { createTwitchAPI } from "../lib/twitch_api/twitch_api.ts";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useAsync } from "./useAsync.ts";

export function useTwitchAPI() {
  const {
    oauth: { token },
    clientID,
    twitchAPI,
    _setTwitchAPI,
  } = useTwitchCtx();

  useEffect(() => {
    if (!twitchAPI && clientID && token) {
      createTwitchAPI(clientID, token).then((api) => _setTwitchAPI(api));
    }
  }, [clientID, token, _setTwitchAPI, twitchAPI]);

  const _getStream = useCallback(
    async (name: string | string[]): Promise<Stream[]> => {
      if (!twitchAPI) {
        return [];
      }
      try {
        const names = Array.isArray(name)
          ? name.map((n) => n.toLowerCase())
          : name.toLowerCase();
        return await twitchAPI.getStreamByLogin(names);
      } catch (e) {
        return [];
      }
    },
    [twitchAPI],
  );
  const { execute: getStream, loading: getStreamLoading } = useAsync(
    _getStream,
  );

  const _getFollowing = useCallback(async () => {
    if (!twitchAPI) return null;
    const followers = await twitchAPI?.getLiveFollowedChannels();
    return followers.data;
  }, [twitchAPI]);

  const { execute: getFollowing, loading: getFollowingLoading } = useAsync(
    _getFollowing,
  );

  return {
    twitchAPI,
    getStream,
    getStreamLoading,
    getFollowing,
    getFollowingLoading,
  };
}
