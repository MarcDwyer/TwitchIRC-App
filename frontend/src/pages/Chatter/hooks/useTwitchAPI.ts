import { useCallback } from "react";
import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";
import { useAsync } from "./useAsync.ts";
import { useChatterCtx } from "@Chatter/context/chatterctx.tsx";

export function useTwitchAPI() {
  const { twitchAPI } = useChatterCtx();

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

  const _getUser = useCallback(
    async (names: string[] | string): Promise<UserInfo[]> => {
      if (!twitchAPI) throw "TwitchAPI not yet set";
      const users = await twitchAPI.getUserByLogin(names);
      return users;
    },
    [twitchAPI],
  );

  const users = useAsync(_getUser);

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
    users,
    getFollowing,
  };
}
