import { useCallback, useEffect, useRef, useState } from "react";
import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "@/hooks/useTwitchAPI.ts";
import { createPinnedChanMap, updatedPinnedStreams } from "../util/pinned.ts";

export const PINNED_KEY = "pinned_key";

export type PinnedChannel = {
  userInfo: UserInfo;
  streamInfo: Stream | null;
};

export type PinnedChannelMap = Map<string, PinnedChannel>;

export function usePinned() {
  const { twitchAPI } = useTwitchAPI();
  const [pinned, setPinned] = useState<PinnedChannelMap>(new Map());
  const [checkedLS, setCheckedLS] = useState<boolean>(false);

  const pinnedRef = useRef<Map<string, PinnedChannel>>(new Map());

  const addPinnedFromStream = async (stream: Stream) => {
    const usersInfo = await twitchAPI.getUserByLogin(stream.user_login);
    if (!usersInfo.length) return;
    const pinnedChannel: PinnedChannel = {
      userInfo: usersInfo[0],
      streamInfo: stream,
    };
    const updatedPinnned = new Map(pinned).set(
      stream.user_login,
      pinnedChannel,
    );
    setPinned(updatedPinnned);
  };

  const addPinnedFromUser = (user: UserInfo) => {
    const pinnedChannel: PinnedChannel = {
      userInfo: user,
      streamInfo: null,
    };
    const updatedPinnned = new Map(pinned).set(user.login, pinnedChannel);
    setPinned(updatedPinnned);

    twitchAPI.getStreamByLogin(user.login).then((streams) => {
      if (!streams.length) return;
      const stream = streams[0];
      const updatedPin: PinnedChannel = {
        ...pinnedChannel,
        streamInfo: stream,
      };
      setPinned(new Map(pinned).set(stream.user_login, updatedPin));
    });
  };
  const addPinnedFromLogin = async (login: string) => {
    const userInfo = await twitchAPI.getUserByLogin(login);
    if (!userInfo.length) return;
    const user = userInfo[0];
    addPinnedFromUser(user);
  };
  const removePinned = (login: string) => {
    const updatedDel = new Map(pinned);
    updatedDel.delete(login);
    setPinned(updatedDel);
  };

  const checkLSForPinned = useCallback(async () => {
    const lsPinned = localStorage.getItem(PINNED_KEY);
    if (!lsPinned) return;
    const pinnedLogins = JSON.parse(lsPinned) as string[];
    const usersInfo = await twitchAPI.getUserByLogin(pinnedLogins);
    const streamsInfo = await twitchAPI.getStreamByLogin(
      usersInfo.map((user) => user.login),
    );

    const pinnedMap = createPinnedChanMap(usersInfo, streamsInfo);
    setPinned(pinnedMap);
  }, [twitchAPI]);

  useEffect(() => {
    if (!checkedLS) {
      checkLSForPinned();
      setCheckedLS(true);
    }
  }, [checkLSForPinned, checkedLS]);

  useEffect(() => {
    if (checkedLS && pinned.size) {
      localStorage.setItem(
        PINNED_KEY,
        JSON.stringify(Array.from(pinned.keys())),
      );
    }
  }, [checkedLS, pinned]);

  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    const refreshLive = async () => {
      const userLogins = Array.from(pinnedRef.current.keys());
      const streams = await twitchAPI.getStreamByLogin(userLogins);
      setPinned((prevPinned) => updatedPinnedStreams(prevPinned, streams));
    };
    const timer = setInterval(refreshLive, 60000 * 3);
    return function () {
      clearInterval(timer);
    };
  }, []);

  return {
    pinned,
    addPinnedFromUser,
    addPinnedFromStream,
    removePinned,
    addPinnedFromLogin,
  };
}
