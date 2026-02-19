import { delay } from "@/pages/Chatter/util/delay";
import { IrcMessage } from "@/types/twitch_data";
import { useEffect, useRef, useState } from "react";

export function useMessages(channel: string) {
  const [messages, setMessages] = useState<IrcMessage[]>([]);
  const buffer = useRef<IrcMessage[]>([]);
  const batching = useRef<boolean>(false);

  const handleMessage = async (msg: IrcMessage) => {
    buffer.current.push(msg);
    if (batching.current) return;
    batching.current = true;

    const batch = async () => {
      while (buffer.current.length) {
        const snippet = buffer.current.splice(0, 10);
        // updateChatters(snippet);
        setMessages((prev) => {
          const limit = 200;
          const nextLen = prev.length + snippet.length;
          if (nextLen >= limit) {
            prev.splice(0, nextLen - limit);
          }
          const updated = [...prev, ...snippet];
          return updated;
        });

        await delay(750);
      }
    };
    await batch();
    batching.current = false;
  };

  const addMessage = (msg: IrcMessage) =>
    setMessages((prevMsgs) => [...prevMsgs, msg]);

  const reset = () => {
    setMessages([]);
    buffer.current = [];
    batching.current = false;
  };
  return {
    handleMessage,
    messages,
    addMessage,
    reset,
  };
}
