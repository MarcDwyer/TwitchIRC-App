import { useEffect, useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "./useTwitchAPI.ts";

export function useFollowing(): [Stream[] | null, boolean] {
  const [following, setFollowing] = useState<Stream[] | null>(null);
  const { getFollowing, getFollowingLoading } = useTwitchAPI();

  useEffect(() => {
    if (!following) {
      getFollowing().then(setFollowing);
    }
  }, [following, getFollowing]);

  useEffect(() => {
    let refresh: number;
    if (following) {
      refresh = setInterval(() => {
        getFollowing().then(setFollowing);
      }, 60000 * 3);
    }
    return function () {
      if (refresh) clearInterval(refresh);
    };
  }, [getFollowing, following]);

  return [following, getFollowingLoading];
}
