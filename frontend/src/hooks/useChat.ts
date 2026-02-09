import { useCallback, useEffect, useRef, useState } from "react";
import { handleMessage, PrivMsgEvt } from "../util/handleMessage.ts";
import { useUserInfo } from "./useUserInfo.ts";
import { delay } from "../util/delay.ts";

export function useChat(ws: WebSocket, channel: string) {
  const [messages, setMessages] = useState<PrivMsgEvt[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const userInfo = useUserInfo();

  const queue = useRef<PrivMsgEvt[]>([]);

  const throttleMsgs = useCallback(async () => {
    setUpdating(true);
    const throttle = async () => {
      while (queue.current.length) {
        const snippet = queue.current.splice(0, 10);
        setMessages((prev) => [...prev, ...snippet]);
        await delay(750);
      }
    };
    await throttle();
    setUpdating(false);
  }, [setMessages, setUpdating]);

  const send = useCallback(
    (msg: string, broadcast: boolean) => {
      if (!userInfo || !ws) return;

      const privMsg: PrivMsgEvt = {
        username: userInfo.display_name ?? "",
        message: msg,
        channel,
      };
      setMessages((prev) => [...prev, privMsg]);
      if (broadcast) {
        ws.send(`PRIVMSG ${channel} :${msg}`);
      }
    },
    [ws, userInfo, channel, setMessages],
  );
  useEffect(() => {
    const ref = ({ data }: MessageEvent<string>) => {
      handleMessage(data, {
        PRIVMSG: (msg) => {
          if (msg.channel === channel) {
            queue.current.push(msg);
            if (!updating) throttleMsgs();
          }
        },
        JOIN: (chanName) => {
          if (chanName === channel) setJoined(true);
        },
      });
    };
    ws.addEventListener("message", ref);

    return function () {
      ws.removeEventListener("message", ref);
    };
  }, [ws, channel, throttleMsgs, updating]);

  useEffect(() => {
    if (!joined) {
      ws.send(`Join ${channel}`);
    }
  }, [joined, ws, channel, setJoined]);

  const isMentioned = useCallback(
    (msg: PrivMsgEvt) => {
      if (!userInfo) return false;
      return msg.message
        .toLowerCase()
        .includes(userInfo.display_name.toLowerCase());
    },
    [userInfo],
  );
  console.log({ updating });
  return {
    channel,
    messages,
    joined,
    send,
    isMentioned,
  };
}
