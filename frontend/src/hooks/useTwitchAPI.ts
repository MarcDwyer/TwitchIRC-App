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

  const _getStreams = useCallback(
    async (names: string[] | string): Promise<Stream[]> => {
      try {
        if (!twitchAPI) throw "TwitchAPI not yet set";
        const streams = await twitchAPI.getStreamByLogin(names);
        if (!streams.length) {
          throw "Either streams aren't live or do not exist";
        }
        return streams;
      } catch (e) {
        throw e;
      }
    },
    [twitchAPI],
  );

  const streams = useAsync(_getStreams);

  const getFollowing = useCallback(async () => {
    try {
      if (!twitchAPI) throw "TwitchAPI not yet set";
      const followers = await twitchAPI.getLiveFollowedChannels();
      return followers.data;
    } catch (e) {
      throw e;
    }
  }, [twitchAPI]);

  return {
    twitchAPI,
    streams,
    getFollowing,
  };
}
