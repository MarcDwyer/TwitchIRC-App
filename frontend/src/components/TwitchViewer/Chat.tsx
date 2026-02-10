import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat.ts";
import { BroadcastHandler } from "../../pages/Dashboard/Dashboard.tsx";
import { useAutocomplete } from "../../hooks/useAutocomplete.ts";
import { checkForAutoComplete } from "../../util/autcomplete.ts";
import { usePause } from "../../hooks/usePause.ts";

type Props = {
  ws: WebSocket;
  channel: string;
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
};

export function Chat({ ws, channel, broadcastHandlers }: Props) {
  const [input, setInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    updateSeen,
    filteredUsers,
    setAutoComplete,
    disableAutoComplete,
    autocomplete,
  } = useAutocomplete();

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredUsers]);

  const onSelect = (user: string) => {
    const str = input;
    const { left, right } = autocomplete;
    console.log({ left: str[left], right: str[right] });

    const start = str.slice(0, autocomplete.left);
    const end = str.slice(autocomplete.right + 1, str.length);

    const result = start + user + end;
    console.log({ start, end, result });
    setInput(result);
    disableAutoComplete();
    const pos = left + user.length;
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    });
  };

  const { messages, send, isMentioned } = useChat(ws, channel, updateSeen);
  const { chatRef, paused, handleScroll, resumeChat } = usePause(messages);

  useEffect(() => {
    const funcRef = (msg: string) => {
      send(msg, true);
    };
    broadcastHandlers.current.push(funcRef);
    return function () {
      const index = broadcastHandlers.current.indexOf(funcRef);
      if (index !== -1) broadcastHandlers.current.splice(index, 1);
    };
  }, [send]);
  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-1"
      >
        {messages.map((msg, i) => {
          const mentioned = isMentioned(msg);
          return (
            <div
              key={i}
              className={`text-sm ${mentioned ? "bg-purple-500/20 border-l-2 border-purple-500 pl-2 -ml-2" : ""}`}
            >
              <span
                className="font-semibold"
                style={{ color: msg.tags["color"] ?? "#a78bfa" }}
              >
                {msg.username}
              </span>
              <span className="text-zinc-500">: </span>
              <span className="text-zinc-300">{msg.message}</span>
            </div>
          );
        })}
      </div>
      {paused && (
        <button
          type="button"
          onClick={resumeChat}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg transition-colors cursor-pointer"
        >
          Chat paused. Click to resume.
        </button>
      )}
      <div className="relative px-3 py-2 border-t border-zinc-700">
        {filteredUsers.length >= 1 && (
          <div className="absolute bottom-full left-0 right-0 mx-3 mb-1 bg-zinc-800 border border-zinc-600 rounded shadow-lg max-h-40 overflow-y-auto">
            {filteredUsers.map((user, i) => (
              <button
                key={user}
                type="button"
                onClick={() => onSelect(user)}
                className={`w-full text-left px-3 py-1.5 text-sm cursor-pointer ${
                  i === selectedIndex
                    ? "bg-purple-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {user}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input, true);
            setInput("");
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              const target = e.target;
              setInput(target.value);
              if (target.selectionStart) {
                const check = checkForAutoComplete(
                  e.target.value,
                  target.selectionStart,
                );
                setAutoComplete(check);
              } else {
                disableAutoComplete();
              }
            }}
            onKeyDown={(e) => {
              if (filteredUsers.length === 0) return;
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(0, i - 1));
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) =>
                  Math.min(filteredUsers.length - 1, i + 1),
                );
              } else if (e.key === "Tab" || e.key === "Enter") {
                e.preventDefault();
                onSelect(filteredUsers[selectedIndex]);
              } else if (e.key === "Escape") {
                setSelectedIndex(0);
              }
            }}
            placeholder="Send a message"
            className="w-full bg-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500"
          />
        </form>
      </div>
    </div>
  );
}
