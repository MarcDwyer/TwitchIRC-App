import { useEffect, useRef, useState } from "react";
import { useAutocomplete } from "../../hooks/useAutocomplete.ts";
import { useChat } from "../../hooks/useChat.ts";
import { BroadcastHandler } from "../../pages/Dashboard/Dashboard.tsx";

type Props = {
  ws: WebSocket;
  channel: string;
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
};

export function Chat({ ws, channel, broadcastHandlers }: Props) {
  const [input, setInput] = useState("");
  const { messages, send, isMentioned } = useChat(ws, channel);
  const chatRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const autocomplete = useAutocomplete(input, messages);

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

  useEffect(() => {
    const el = chatRef.current;
    if (!el || paused) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, paused]);

  function handleScroll() {
    const el = chatRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setPaused(distanceFromBottom > 30);
  }

  function resumeChat() {
    setPaused(false);
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

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
                style={{ color: msg.color || "#a78bfa" }}
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
        {autocomplete.active && (
          <div className="absolute bottom-full left-0 right-0 mx-3 mb-1 bg-zinc-800 border border-zinc-600 rounded shadow-lg max-h-40 overflow-y-auto">
            {autocomplete.suggestions.map((user, i) => (
              <button
                key={user}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const result = autocomplete.complete(i);
                  if (result) setInput(result);
                }}
                className={`w-full text-left px-3 py-1.5 text-sm cursor-pointer ${
                  i === autocomplete.selectedIndex
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
            if (autocomplete.active) return;
            send(input, true);
            setInput("");
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              const result = autocomplete.onKeyDown(e);
              if (result) setInput(result);
            }}
            placeholder="Send a message"
            className="w-full bg-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500"
          />
        </form>
      </div>
    </div>
  );
}
