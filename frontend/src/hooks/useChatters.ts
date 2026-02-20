import { IrcMessage } from "@/types/twitch_data";
import { useEffect, useRef } from "react";

const isOlderThanMins = (timestamp: number, mins: number) =>
  Date.now() - timestamp > mins * 60 * 1000;

export function useChatters() {
  const chatters = useRef<Map<string, number>>(new Map());

  const addChatter = (msg: IrcMessage) =>
    chatters.current.set(msg.username, Date.now());

  const reset = () => {
    chatters.current = new Map();
  };

  useEffect(() => {
    const delIdleChatters = (prevChatters: Map<string, number>) => {
      const updated = new Map(prevChatters);
      const removed = [];
      for (const [username, lastMsg] of updated.entries()) {
        if (isOlderThanMins(lastMsg, 10)) {
          removed.push(username);
          updated.delete(username);
        }
      }
      return updated;
    };

    const delIdleTimer = setInterval(
      () => (chatters.current = delIdleChatters(chatters.current)),
      60000 * 10,
    );
    return function () {
      clearInterval(delIdleTimer);
      chatters.current = new Map();
    };
  }, []);

  return {
    chatters: chatters.current,
    addChatter,
    reset,
  };
}
