import { useCallback, useEffect, useState } from "react";
import { Stream, UserInfo } from "../lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "./useTwitchAPI.ts";

const PINNED_KEY = "pinned_key";

function setPinnedInLS(pinned: Map<string, UserInfo>) {
  const users = Array.from(pinned.keys());
  localStorage.setItem(PINNED_KEY, JSON.stringify(users));
}

export function usePinned() {
  const { users, streams } = useTwitchAPI();
  const [pinned, setPinned] = useState<Map<string, UserInfo>>(new Map());
  const [livePinned, setLivePinned] = useState<Map<string, Stream>>(new Map());

  const addPinned = (user: UserInfo) => {
    setPinned((prev) => {
      const updated = new Map(prev).set(user.login, user);
      setPinnedInLS(updated);
      return updated;
    });
    streams.execute(user.login).then((stream) => {
      console.log({ stream });
      setLivePinned(new Map(livePinned).set(stream[0].user_name, stream[0]));
    }).catch(console.log);
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

  const getLivePin = (username: string) => livePinned.get(username);

  const checkForLiveStreams = useCallback((users: UserInfo[]) => {
    streams.execute(users.map((user) => user.login)).then((streams) => {
      const updatedLivePinned = streams.reduce((map, stream) => {
        return map.set(stream.user_login, stream);
      }, new Map() as Map<string, Stream>);
      setLivePinned(updatedLivePinned);
    });
  }, [streams.execute]);

  useEffect(() => {
    const lsPinned = localStorage.getItem(PINNED_KEY);
    if (!lsPinned) return;
    const pinnedLogins = JSON.parse(lsPinned) as string[];
    (async () => {
      try {
        const userData = await users.execute(pinnedLogins);
        if (!userData) return;
        console.log("1");
        checkForLiveStreams(userData);
        setPinned((prevPinned) => {
          const updated = new Map(prevPinned);
          for (const user of userData) {
            updated.set(user.login, user);
          }
          return updated;
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [users.execute, checkForLiveStreams]);

  return {
    pinned,
    addPinned,
    removePinned,
    getLivePin,
  };
}
