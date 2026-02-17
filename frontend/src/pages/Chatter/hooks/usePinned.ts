import { useCallback, useEffect, useRef, useState } from "react";
import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "@/hooks/useTwitchAPI.ts";
import { TwitchAPI } from "../../../lib/twitch_api/twitch_api.ts";

const PINNED_KEY = "pinned_key";

type PinnedChannel = {
  userInfo: UserInfo;
  streamInfo: Stream | null;
};

export type PinnedChannelMap = Map<string, PinnedChannel>;

function createPinnedChanMap(users: UserInfo[], streams: Stream[]) {
  const map: PinnedChannelMap = new Map();

  for (const user of users) {
    const pinnedChannel: PinnedChannel = {
      userInfo: user,
      streamInfo: streams.find((stream) => stream.user_login === user.login) ??
        null,
    };
    map.set(user.login, pinnedChannel);
  }
  return map;
}

function updatedPinnedStreams(
  map: Map<string, PinnedChannel>,
  streams: Stream[],
) {
  const updated: PinnedChannelMap = new Map(map);

  for (const stream of streams) {
    const pinnedChan = updated.get(stream.user_login);
    if (pinnedChan) {
      pinnedChan.streamInfo = stream;
    }
  }
  return updated;
}

function setPinnedInLS(pinned: PinnedChannelMap) {
  const users = Array.from(pinned.keys());
  localStorage.setItem(PINNED_KEY, JSON.stringify(users));
}

const getStreamsOfUsers = async (users: UserInfo[], twitchAPI: TwitchAPI) => {
  const usersStr = users.map((user) => user.login);
  return await twitchAPI.getStreamByLogin(usersStr);
};

export function usePinned() {
  const { twitchAPI } = useTwitchAPI();
  const [pinned, setPinned] = useState<PinnedChannelMap>(new Map());
  // const [livePinned, setLivePinned] = useState<Map<string, Stream>>(new Map());

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
    setPinnedInLS(updatedPinnned);
  };

  const addPinnedFromUser = (user: UserInfo) => {
    const pinnedChannel: PinnedChannel = {
      userInfo: user,
      streamInfo: null,
    };
    const updatedPinnned = new Map(pinned).set(user.login, pinnedChannel);
    setPinned(updatedPinnned);
    setPinnedInLS(updatedPinnned);

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

  const removePinned = (login: string) => {
    const updatedDel = new Map(pinned);
    updatedDel.delete(login);
    setPinned(updatedDel);
  };

  const checkLSForPinned = useCallback(async () => {
    const lsPinned = localStorage.getItem(PINNED_KEY);
    if (!lsPinned) return;
    console.log("trhis rann...");
    const pinnedLogins = JSON.parse(lsPinned) as string[];
    const usersInfo = await twitchAPI.getUserByLogin(pinnedLogins);
    const streamsInfo = await getStreamsOfUsers(usersInfo, twitchAPI);

    const pinnedMap = createPinnedChanMap(usersInfo, streamsInfo);
    setPinned(pinnedMap);
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
  };
}
