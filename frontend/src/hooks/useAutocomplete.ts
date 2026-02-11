import { useCallback, useEffect, useMemo, useState } from "react";
import { IrcMessage } from "../types/twitch_data.ts";
import { CheckAutoCompleteReturn } from "../util/autcomplete.ts";

const isOlderThan10Min = (timestamp: number) =>
  Date.now() - timestamp > 10 * 60 * 1000;

export function useAutocomplete() {
  const [seen, setSeen] = useState<Map<string, number>>(new Map());
  const [autocomplete, setAutoComplete] = useState<CheckAutoCompleteReturn>({
    isAutoComplete: false,
    word: "",
    left: -1,
    right: -1,
  });
  const disableAutoComplete = () =>
    setAutoComplete({ ...autocomplete, isAutoComplete: false });

  const updateSeen = useCallback(
    (newMsgs: IrcMessage[]) => {
      const updated = new Map(seen);
      for (const msg of newMsgs) {
        updated.set(msg.username, Date.now());
      }
      setSeen(updated);
    },
    [seen],
  );
  const filteredUsers: string[] = useMemo(() => {
    if (!autocomplete.isAutoComplete) return [];
    return Array.from(seen.keys()).filter((username) =>
      username.startsWith(autocomplete.word),
    );
  }, [autocomplete, seen]);

  const cleanSeen = useCallback(() => {
    setSeen((prevSeen) => {
      const updated = new Map(prevSeen);
      const removed = [];
      for (const [username, lastMsg] of updated.entries()) {
        const isOld = isOlderThan10Min(lastMsg);
        if (isOld) {
          removed.push(username);
          updated.delete(username);
        }
      }
      console.log({ removed });
      return updated;
    });
  }, []);

  useEffect(() => {
    const cleanup = setInterval(cleanSeen, 1000 * 60 * 10);
    return function () {
      console.log("unmounting seen");
      clearInterval(cleanup);
    };
  }, [cleanSeen]);

  return {
    updateSeen,
    filteredUsers,
    setAutoComplete,
    disableAutoComplete,
    autocomplete,
  };
}
