import { useCallback, useMemo, useState } from "react";
import { IrcMessage } from "../types/twitch_data.ts";
import { CheckAutoCompleteReturn } from "../util/autcomplete.ts";

export function useAutocomplete() {
  const [seen, setSeen] = useState<Set<string>>(new Set());
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
      const updated: Set<string> = new Set(seen);
      for (const msg of newMsgs) {
        updated.add(msg.username);
      }
      setSeen(updated);
    },
    [seen, setSeen],
  );
  const filteredUsers: string[] = useMemo(() => {
    if (!autocomplete.isAutoComplete) return [];
    return Array.from(seen).filter((username) =>
      username.startsWith(autocomplete.word),
    );
  }, [autocomplete, seen]);

  console.log({ autocomplete });
  return {
    updateSeen,
    filteredUsers,
    setAutoComplete,
    disableAutoComplete,
  };
}
