import { useCallback, useEffect, useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "./useTwitchAPI.ts";

export function useFollowing() {
  const [following, setFollowing] = useState<Stream[] | null>(null);
  const twitchAPI = useTwitchAPI();

  const getFollowing = useCallback(() => {
    if (!twitchAPI) return;
    console.log("ref followers");
    twitchAPI
      ?.getLiveFollowedChannels()
      .then((resp) => setFollowing(resp.data));
  }, [twitchAPI, setFollowing]);

  useEffect(() => {
    if (!following) {
      getFollowing();
    }
  }, [following, getFollowing]);

  useEffect(() => {
    let refresh: number;
    if (following) {
      refresh = setInterval(getFollowing, 1000 * 10 * 3);
    }
    return function () {
      if (refresh) clearInterval(refresh);
    };
  }, [getFollowing, following]);

  return following;
}
