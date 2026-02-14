import { useEffect, useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "./useTwitchAPI.ts";

export function useFollowing() {
  const [following, setFollowing] = useState<Stream[] | null>(null);
  const { getFollowing } = useTwitchAPI();

  useEffect(() => {
    if (!following) {
      getFollowing().then(setFollowing).catch(() => {});
    }
  }, [following, getFollowing]);

  useEffect(() => {
    let refresh: number;
    if (following) {
      refresh = setInterval(() => {
        getFollowing().then(setFollowing).catch(() => {});
      }, 60000 * 3);
    }
    return function () {
      if (refresh) clearInterval(refresh);
    };
  }, [getFollowing, following]);

  return following;
}
