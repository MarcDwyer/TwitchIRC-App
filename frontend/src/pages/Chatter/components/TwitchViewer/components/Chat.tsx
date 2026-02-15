import { useEffect, useRef, useState } from "react";
import { useChat } from "@Chatter/hooks/useChat.ts";
import { useAutocomplete } from "@Chatter/hooks/useAutocomplete.ts";
import { usePause } from "@Chatter/hooks/usePause.ts";
import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";
import { Autocomplete } from "./Autocomplete.tsx";
import { useChatterCtx } from "@Chatter/context/chatterctx.tsx";

type Props = {
  channel: string;
  stream: Stream;
};
export type InputData = {
  text: string;
  startingIndex: number | null;
};
export function Chat({ channel }: Props) {
  const [inputData, setInputData] = useState<InputData>({
    text: "",
    startingIndex: 0,
  });

  const { broadcastHandlers } = useChatterCtx();

  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, send, isMentioned, chatters } = useChat(channel);

  const { disableAutoComplete, autocomplete } = useAutocomplete(inputData);

  const onSelect = (user: string) => {
    const str = inputData.text;
    const { left, right } = autocomplete;

    const start = str.slice(0, left);
    const end = str.slice(right + 1, str.length);
    const space = right === str.length - 1 ? " " : "";

    const result = start + user + space + end;
    const pos = left + user.length + 1;
    setInputData({
      startingIndex: pos,
      text: result,
    });
    // disableAutoComplete();
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    });
  };

  const { chatRef, paused, handleScroll, resumeChat } = usePause(messages);

  useEffect(() => {
    const funcRef = (msg: string) => {
      send(msg);
    };
    broadcastHandlers.current.push(funcRef);
    return function () {
      const index = broadcastHandlers.current.indexOf(funcRef);
      if (index !== -1) broadcastHandlers.current.splice(index, 1);
    };
  }, [send]);

  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
      >
        {messages.map((msg, i) => {
          const mentioned = isMentioned(msg);
          const color = msg.tags.color && msg.tags.color !== ""
            ? msg.tags.color
            : "#a78bfa";
          const isSub = msg.tags.subscriber === "1";
          return (
            <div
              key={i}
              className={`text-sm ${
                mentioned
                  ? "bg-purple-500/20 border-l-2 border-purple-500 pl-2 -ml-2"
                  : ""
              }`}
            >
              {isSub && (
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1 align-middle" />
              )}{" "}
              <span className="font-semibold" style={{ color }}>
                {msg.username}
              </span>
              <span className="text-zinc-500">:</span>{" "}
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
            onSelect={onSelect}
            inputRef={inputRef}
            word={autocomplete.word}
            disableAutocomplete={disableAutoComplete}
            chatters={chatters}
          />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(inputData.text);
            setInputData({ text: "", startingIndex: 0 });
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputData.text}
            onChange={(e) => {
              const target = e.target;
              setInputData({
                text: target.value,
                startingIndex: target.selectionStart,
              });
            }}
            placeholder="Send a message"
            className="w-full bg-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500"
          />
        </form>
      </div>
    </div>
  );
}
