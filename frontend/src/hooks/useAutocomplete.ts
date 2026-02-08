import { useCallback, useMemo, useState } from "react";
import { PrivMsgEvt } from "../util/handleMessage.ts";

export function useAutocomplete(input: string, messages: PrivMsgEvt[]) {
  const [arrowOffset, setArrowOffset] = useState(0);

  const users = useMemo(() => {
    const seen = new Set<string>();
    for (const msg of messages) {
      seen.add(msg.username);
    }
    return [...seen];
  }, [messages]);

  const { active, suggestions, atIndex } = useMemo(() => {
    const lastAt = input.lastIndexOf("@");
    if (lastAt === -1 || (lastAt > 0 && input[lastAt - 1] !== " ")) {
      return { active: false, suggestions: [] as string[], atIndex: -1 };
    }

    const query = input.slice(lastAt + 1);
    if (query.includes(" ")) {
      return { active: false, suggestions: [] as string[], atIndex: -1 };
    }

    const filtered = users.filter((u) =>
      u.toLowerCase().startsWith(query.toLowerCase()),
    );

    return {
      active: filtered.length > 0,
      suggestions: filtered,
      atIndex: lastAt,
    };
  }, [input, users]);

  const selectedIndex =
    suggestions.length > 0
      ? ((arrowOffset % suggestions.length) + suggestions.length) %
        suggestions.length
      : 0;

  const complete = useCallback(
    (index?: number) => {
      if (!active || suggestions.length === 0) return null;
      const selected = suggestions[index ?? selectedIndex] ?? suggestions[0];
      return input.slice(0, atIndex) + `@${selected} `;
    },
    [active, suggestions, selectedIndex, input, atIndex],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent): string | null => {
      if (!active) return null;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setArrowOffset((prev) => prev - 1);
          return null;
        case "ArrowDown":
          e.preventDefault();
          setArrowOffset((prev) => prev + 1);
          return null;
        case "Tab":
        case "Enter":
          e.preventDefault();
          setArrowOffset(0);
          return complete();
        case "Escape":
          e.preventDefault();
          setArrowOffset(0);
          return null;
        default:
          return null;
      }
    },
    [active, complete],
  );

  return {
    active,
    suggestions,
    selectedIndex,
    onKeyDown,
    complete,
  };
}
