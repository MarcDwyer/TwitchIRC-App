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

  const deferUpdate = useCallback(async () => {
    setUpdating(true);
    const scan = async () => {
      while (queue.current.length) {
        console.log(queue.current);
        const firstFive = queue.current.splice(0, 10);
        setMessages((prev) => [...prev, ...firstFive]);
        await delay(750);
      }
    };
    await scan();
    console.log("scan completed");
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
            if (!updating) deferUpdate();
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
  }, [ws, channel, deferUpdate, updating]);

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
