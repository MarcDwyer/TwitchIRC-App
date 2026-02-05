import { useState } from "react";
import { Channel, ChatMessageEvent } from "../lib/irc/channel.ts";

type Props = {
  messages: ChatMessageEvent[];
  channel: Channel;
  addMsg: (msg: string) => void;
};

export function Chat({ messages, channel, addMsg }: Props) {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-1 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <span className="text-purple-400 font-semibold">
              {msg.username}
            </span>
            <span className="text-zinc-500">:</span>
            <span className="text-zinc-300">{msg.content}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          channel.send(input);
          addMsg(input);
          setInput("");
        }}
        className="px-3 py-2 border-t border-zinc-700"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message"
          className="w-full bg-zinc-700 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-1.5 outline-none focus:ring-1 focus:ring-purple-500"
        />
      </form>
    </div>
  );
}
