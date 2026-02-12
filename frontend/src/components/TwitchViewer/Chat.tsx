import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat.ts";
import { BroadcastHandler } from "../../pages/Dashboard/Dashboard.tsx";
import { useAutocomplete } from "../../hooks/useAutocomplete.ts";
import { checkForAutoComplete } from "../../util/autcomplete.ts";
import { usePause } from "../../hooks/usePause.ts";
import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { Autocomplete } from "./Autocomplete.tsx";

type Props = {
  ws: WebSocket;
  channel: string;
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
  stream: Stream;
};

export function Chat({ ws, channel, broadcastHandlers, stream }: Props) {
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    updateChatters,
    chatters,
    setAutoComplete,
    disableAutoComplete,
    autocomplete,
  } = useAutocomplete(stream);

  const onSelect = (user: string) => {
    const str = input;
    const { left, right } = autocomplete;

    const start = str.slice(0, left);
    const end = str.slice(right + 1, str.length);

    const result = start + user + end;
    setInput(result);
    disableAutoComplete();
    const pos = left + user.length + 1;
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    });
  };

  const { messages, send, isMentioned } = useChat(ws, channel, updateChatters);
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
              className={`text-sm ${
                mentioned
                  ? "bg-purple-500/20 border-l-2 border-purple-500 pl-2 -ml-2"
                  : ""
              }`}
            >
              <span
                className="font-semibold"
                style={{ color: msg.tags["color"] ?? "#a78bfa" }}
              >
                {msg.username}
              </span>
              <span className="text-zinc-500">:</span>
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
        {autocomplete.isAutoComplete && (
          <Autocomplete
            chatters={chatters}
            onSelect={onSelect}
            inputRef={inputRef}
            word={autocomplete.word}
          />
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
            placeholder="Send a message"
            className="w-full bg-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500"
          />
        </form>
      </div>
    </div>
  );
}
