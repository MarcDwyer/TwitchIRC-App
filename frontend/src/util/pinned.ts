import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";
import {
  PINNED_KEY,
  PinnedChannel,
  PinnedChannelMap,
} from "../hooks/usePinned.ts";

export function createPinnedChanMap(users: UserInfo[], streams: Stream[]) {
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

export function updatedPinnedStreams(
  map: Map<string, PinnedChannel>,
  streams: Stream[],
) {
  const updated: PinnedChannelMap = new Map(map);

  for (const pinned of updated.values()) {
    pinned.streamInfo = null;
  }

  for (const stream of streams) {
    const pinnedChan = updated.get(stream.user_login);
    if (pinnedChan) {
      pinnedChan.streamInfo = stream;
    }
  }
  return updated;
}

export function setPinnedInLS(pinned: PinnedChannelMap) {
  const users = Array.from(pinned.keys());
  localStorage.setItem(PINNED_KEY, JSON.stringify(users));
}
