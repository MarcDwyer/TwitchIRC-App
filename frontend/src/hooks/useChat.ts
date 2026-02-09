import { useCallback, useEffect, useRef, useState } from "react";
import { handleChannelMsg, HandleMsgCallbacks } from "../util/handleMessage.ts";
import { useUserInfo } from "./useUserInfo.ts";
import { delay } from "../util/delay.ts";
import { createIRCMessage } from "../util/createIRCMessage.ts";
import { IrcMessage } from "../types/twitch_data.ts";

const addUserState = (msg: IrcMessage, userState: IrcMessage | null) => {
  if (!userState) return msg;
  Object.assign(msg, { tags: userState.tags });
};

export function useChat(ws: WebSocket, channel: string) {
  const [messages, setMessages] = useState<IrcMessage[]>([]);
  const [joined, setJoined] = useState<boolean>(false);

  const userInfo = useUserInfo();

  const queue = useRef<IrcMessage[]>([]);
  const throttling = useRef<boolean>(false);

  const userState = useRef<IrcMessage | null>(null);

  const throttleMsgs = useCallback(async () => {
    throttling.current = true;
    const throttle = async () => {
      while (queue.current.length) {
        const snippet = queue.current.splice(0, 10);
        setMessages((prev) => {
          const limit = 200;
          const nextLen = prev.length + snippet.length;
          if (nextLen >= limit) {
            prev.splice(0, nextLen - limit);
          }
          return [...prev, ...snippet];
        });
        await delay(750);
      }
    };
    await throttle();
    throttling.current = false;
  }, [setMessages]);

  const send = useCallback(
    (msg: string, broadcast: boolean) => {
      if (!userInfo || !ws) return;
      const ircMsg = createIRCMessage(
        msg,
        channel,
        userInfo.display_name ?? "",
      );
      addUserState(ircMsg, userState.current);
      setMessages((prev) => [...prev, ircMsg]);
      if (broadcast) {
        ws.send(`PRIVMSG ${channel} :${msg}`);
      }
    },
    [ws, userInfo, channel, setMessages],
  );
  useEffect(() => {
    const ref = ({ data }: MessageEvent<string>) => {
      const cbs: HandleMsgCallbacks = {
        PRIVMSG: (msg) => {
          queue.current.push(msg);
          if (!throttling.current) throttleMsgs();
        },
        USERSTATE: (ircMsg) => {
          console.log({ userState: ircMsg });
          userState.current = ircMsg;
        },
        JOIN: () => {
          setJoined(true);
        },
      };
      handleChannelMsg({ data, channel, cbs });
    };
    ws.addEventListener("message", ref);

    return function () {
      ws.removeEventListener("message", ref);
    };
  }, [ws, channel, throttleMsgs, setJoined]);

  useEffect(() => {
    if (!joined) {
      ws.send(`Join ${channel}`);
    }
  }, [joined, ws, channel, setJoined]);

  const isMentioned = useCallback(
    (msg: IrcMessage) => {
      if (!userInfo) return false;
      return msg.message
        .toLowerCase()
        .includes(userInfo.display_name.toLowerCase());
    },
    [userInfo],
  );
  return {
    channel,
    messages,
    joined,
    send,
    isMentioned,
  };
}
