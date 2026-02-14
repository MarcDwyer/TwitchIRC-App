import { useEffect, useMemo, useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { useTwitchAPI } from "./useTwitchAPI.ts";

const PINNED_KEY = "pinned_key";

export function usePinned() {
  const [pinned, setPinned] = useState<Map<string, Stream>>(new Map());

  const addPinned = (stream: Stream) =>
    setPinned(new Map(pinned).set(stream.user_name, stream));

  const removePinned = (streamName: string) => {
    setPinned((prevPinned) => {
      const updated = new Map(prevPinned);
      updated.delete(streamName);
      return updated;
    });
  };

  const pinnedNames = useMemo(() => {
    return Array.from(pinned.keys());
  }, [pinned]);

  useEffect(() => {
    if (pinnedNames.length) {
      localStorage.setItem(PINNED_KEY, JSON.stringify(pinnedNames));
    }
  }, [pinnedNames]);

  useEffect(() => {
    const lsPinned = localStorage.getItem(PINNED_KEY);
    if (!lsPinned) return;
    const pinnedStreams = JSON.parse(lsPinned) as string[];
    console.log({ pinnedStreams });
  }, []);

  return {
    pinned,
    addPinned,
    removePinned,
  };
}
