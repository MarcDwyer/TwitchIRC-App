import { useCallback, useEffect, useRef, useState } from "react";
import { handleMessage, HandleMsgCallbacks } from "@/util/handleMessage.ts";
import { useUserInfo } from "./useUserInfo.ts";
import { delay } from "@Chatter/util/delay.ts";
import { createIRCMessage } from "@Chatter/util/createIRCMessage.ts";
import { IrcMessage } from "@/types/twitch_data.ts";
import { useChatterCtx } from "@Chatter/context/chatterctx.tsx";

const addUserState = (msg: IrcMessage, userState: IrcMessage | null) => {
  if (!userState) return msg;
  Object.assign(msg, { tags: userState.tags });
};

const isOlderThanMins = (timestamp: number, mins: number) =>
  Date.now() - timestamp > mins * 60 * 1000;

type NewMessagesCB = (msgs: IrcMessage[]) => void;
export function useChat(
  channel: string,
  newMsgsCB?: NewMessagesCB,
) {
  const { ws } = useChatterCtx();
  const [chatters, setChatters] = useState<Map<string, number>>(new Map());
  const [messages, setMessages] = useState<IrcMessage[]>([]);
  const [joined, setJoined] = useState<boolean>(false);

  const userInfo = useUserInfo();

  const buffer = useRef<IrcMessage[]>([]);
  const batching = useRef<boolean>(false);

  const userState = useRef<IrcMessage | null>(null);

  const updateChatters = useCallback((newMsgs: IrcMessage[]) => {
    setChatters((prevChatters) => {
      const updatedChatters = new Map(prevChatters);
      for (const { username } of newMsgs) {
        updatedChatters.set(username, Date.now());
      }
      return updatedChatters;
    });
  }, []);

  const batchMsgs = useCallback(async () => {
    batching.current = true;

    const batch = async () => {
      while (buffer.current.length) {
        const snippet = buffer.current.splice(0, 10);
        updateChatters(snippet);
        setMessages((prev) => {
          const limit = 200;
          const nextLen = prev.length + snippet.length;
          if (nextLen >= limit) {
            prev.splice(0, nextLen - limit);
          }
          const updated = [...prev, ...snippet];
          newMsgsCB?.(updated);
          return updated;
        });

        await delay(750);
      }
    };
    await batch();
    batching.current = false;
  }, [newMsgsCB, updateChatters]);

  const send = useCallback(
    (msg: string) => {
      if (!userInfo || !ws) return;
      const ircMsg = createIRCMessage(
        msg,
        channel,
        userInfo.display_name ?? "",
      );
      addUserState(ircMsg, userState.current);
      setMessages((prev) => [...prev, ircMsg]);
      ws.send(`PRIVMSG ${channel} :${msg}`);
    },
    [ws, userInfo, channel],
  );
  useEffect(() => {
    if (!ws) return;
    const ref = ({ data }: MessageEvent<string>) => {
      const cbs: HandleMsgCallbacks = {
        PRIVMSG: (msg) => {
          buffer.current.push(msg);
          if (!batching.current) batchMsgs();
        },
        USERSTATE: (ircMsg) => {
          userState.current = ircMsg;
        },
        JOIN: () => {
          setJoined(true);
        },
      };
      handleMessage({
        data,
        cbs,
        shouldInvoke: (ircMsg) => ircMsg.channel === channel,
      });
    };
    ws.addEventListener("message", ref);

    return function () {
      ws?.removeEventListener("message", ref);
    };
  }, [ws, channel, batchMsgs]);

  const isMentioned = useCallback(
    (msg: IrcMessage) => {
      if (!userInfo) return false;
      return msg.message
        .toLowerCase()
        .includes(userInfo.display_name.toLowerCase());
    },
    [userInfo],
  );
  useEffect(() => {
    if (!joined && ws) {
      ws.send(`Join ${channel}`);
    }
  }, [joined, ws, channel]);

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
      console.log({ removed, prevChatters });
      return updated;
    };

    const delIdleTimer = setInterval(
      () => setChatters(delIdleChatters),
      60000 * 10,
    );
    return function () {
      clearInterval(delIdleTimer);
    };
  }, []);

  return {
    channel,
    messages,
    joined,
    send,
    isMentioned,
    chatters,
  };
}
