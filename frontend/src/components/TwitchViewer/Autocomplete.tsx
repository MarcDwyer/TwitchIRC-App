import { useEffect, useRef, useState } from "react";

type Props = {
  chatters: Map<string, number>;
  onSelect: (chatter: string) => void;
  word: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  disableAutocomplete: () => void;
};

enum SubmitKeys {
  "Enter",
  "Tab",
}

function matchUsers(word: string, usernames: string[]) {
  return usernames.filter((user) => user.startsWith(word));
}

export function Autocomplete(
  { chatters, onSelect, inputRef, word, disableAutocomplete }: Props,
) {
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState<string[]>(
    [],
  );
  const seenChatters = useRef(Array.from(chatters.keys()));
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const item = container.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [index]);

  useEffect(() => {
    if (!matched.length || !inputRef.current) {
      return;
    }
    const funcRef = (e: KeyboardEvent) => {
      const key = e.key;

      if (key in SubmitKeys && matched[index]) {
        e.preventDefault();
        onSelect(matched[index]);
        return;
      }
      if (key === "Escape") {
        disableAutocomplete();
        return;
      }
      setIndex((prevIndex) => {
        let nextIndex = prevIndex;

        if (key === "ArrowDown") {
          e.preventDefault();
          nextIndex++;
        } else if (key === "ArrowUp") {
          nextIndex--;
          e.preventDefault();
        }
        if (!matched[nextIndex]) {
          return 0;
        }
        return nextIndex;
      });
    };
    inputRef.current.addEventListener("keydown", funcRef);

    return function () {
      inputRef.current?.removeEventListener("keydown", funcRef);
    };
  }, [matched]);

  useEffect(() => {
    setMatched(matchUsers(word, seenChatters.current));
  }, [word]);

  return (
    <>
      <div
        ref={listRef}
        className="absolute bottom-full left-0 right-0 mx-3 mb-1 bg-zinc-800 border border-zinc-600 rounded shadow-lg max-h-40 overflow-y-auto"
      >
        {matched.map((user, i) => (
          <button
            key={user}
            type="button"
            onClick={() => onSelect(user)}
            className={`w-full text-left px-3 py-1.5 text-sm cursor-pointer ${
              i === index
                ? "bg-purple-600 text-white"
                : "text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {user}
          </button>
        ))}
      </div>
    </>
  );
}
