import { useCallback, useEffect, useState } from "react";
import { IrcMessage } from "../types/twitch_data.ts";
import { CheckAutoCompleteReturn } from "../util/autcomplete.ts";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";

const isOlderThan10Min = (timestamp: number) =>
  Date.now() - timestamp > 10 * 60 * 1000;

export function useAutocomplete(stream: Stream) {
  const [chatters, setChatters] = useState<Map<string, number>>(new Map());
  const [autocomplete, setAutoComplete] = useState<CheckAutoCompleteReturn>({
    isAutoComplete: false,
    word: "",
    left: -1,
    right: -1,
  });
  const disableAutoComplete = () =>
    setAutoComplete({ ...autocomplete, isAutoComplete: false });

  const updateChatters = useCallback(
    (newMsgs: IrcMessage[]) => {
      setChatters((prevChatters) => {
        const updated = new Map(prevChatters);
        for (const msg of newMsgs) {
          updated.set(msg.username, Date.now());
        }
        return updated;
      });
    },
    [],
  );

  const removeIdleChatters = useCallback(() => {
    setChatters((prev) => {
      const updated = new Map(prev);
      const removed = [];
      for (const [username, lastMsg] of updated.entries()) {
        const isOld = isOlderThan10Min(lastMsg);
        if (isOld && username !== stream.user_name) {
          removed.push(username);
          updated.delete(username);
        }
      }
      console.log({ removed });
      return updated;
    });
  }, []);

  useEffect(() => {
    const cleanup = setInterval(removeIdleChatters, 1000 * 60 * 10);
    return function () {
      clearInterval(cleanup);
    };
  }, [removeIdleChatters]);

  useEffect(() => {
    setChatters((prev) => prev.set(stream.user_name, -1));
  }, [stream]);

  return {
    updateChatters,
    setAutoComplete,
    disableAutoComplete,
    autocomplete,
    chatters,
  };
}
