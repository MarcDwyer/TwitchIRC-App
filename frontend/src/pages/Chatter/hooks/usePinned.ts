import { useCallback, useEffect, useRef, useState } from "react";
import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "@/hooks/useTwitchAPI.ts";
import { TwitchAPI } from "../../../lib/twitch_api/twitch_api.ts";
import {
  createMapFromStream,
  createMapFromUsers,
} from "../util/chatter_maps.ts";

const PINNED_KEY = "pinned_key";

function setPinnedInLS(pinned: Map<string, UserInfo>) {
  const users = Array.from(pinned.keys());
  localStorage.setItem(PINNED_KEY, JSON.stringify(users));
}

const getStreamsOfUsers = async (users: UserInfo[], twitchAPI: TwitchAPI) => {
  const usersStr = users.map((user) => user.login);
  return await twitchAPI.getStreamByLogin(usersStr);
};

export function usePinned() {
  const { twitchAPI } = useTwitchAPI();
  const [pinned, setPinned] = useState<Map<string, UserInfo>>(new Map());
  const [livePinned, setLivePinned] = useState<Map<string, Stream>>(new Map());

  const pinnedRef = useRef<Map<string, UserInfo>>(new Map());

  const addPinned = (user: UserInfo) => {
    const updatedPinned = new Map(pinned).set(user.login, user);
    console.log({ user, pinned, updatedPinned });

    setPinned(updatedPinned);
    setPinnedInLS(updatedPinned);

    getStreamsOfUsers([user], twitchAPI).then((streamData) => {
      if (streamData.length) {
        const stream = streamData[0];
        const updatedLivePinned = new Map(livePinned).set(
          stream.user_name,
          stream,
        );
        setLivePinned(updatedLivePinned);
      }
    });
  };

  const removePinned = (login: string) => {
    setPinned((prevPinned) => {
      const updated = new Map(prevPinned);
      updated.delete(login);
      setPinnedInLS(updated);
      return updated;
    });
    setLivePinned((prevLivePinned) => {
      const updated = new Map(prevLivePinned);
      updated.delete(login);
      return updated;
    });
  };

  const checkPinnedLive = useCallback(
    (login: string) => livePinned.get(login),
    [livePinned],
  );

  const checkLSForPinned = useCallback(async () => {
    const lsPinned = localStorage.getItem(PINNED_KEY);
    if (!lsPinned) return;
    console.log("trhis rann...");
    const pinnedLogins = JSON.parse(lsPinned) as string[];
    const userData = await twitchAPI.getUserByLogin(pinnedLogins);
    const streamsData = await getStreamsOfUsers(userData, twitchAPI);
    setPinned(createMapFromUsers(userData));
    setLivePinned(createMapFromStream(streamsData));
  }, [twitchAPI]);

  useEffect(() => {
    checkLSForPinned();
  }, [checkLSForPinned]);

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    const refreshLive = async () => {
      const userLogins = Array.from(pinnedRef.current.keys());
      const streams = await twitchAPI.getStreamByLogin(userLogins);
      setLivePinned(createMapFromStream(streams));
    };
    const timer = setInterval(refreshLive, 60000 * 3);
    return function () {
      clearInterval(timer);
    };
  }, []);

  return {
    pinned,
    addPinned,
    removePinned,
    checkPinnedLive,
  };
}
