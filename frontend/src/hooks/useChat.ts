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

type NewMessagesCB = (msgs: IrcMessage[]) => void;
export function useChat(
  ws: WebSocket,
  channel: string,
  newMsgsCB: NewMessagesCB,
) {
  const [messages, setMessages] = useState<IrcMessage[]>([]);
  const [joined, setJoined] = useState<boolean>(false);

  const userInfo = useUserInfo();

  const queue = useRef<IrcMessage[]>([]);
  const batching = useRef<boolean>(false);

  const userState = useRef<IrcMessage | null>(null);

  const batchMsgs = useCallback(async () => {
    batching.current = true;

    const batch = async () => {
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
        newMsgsCB(snippet);
        await delay(750);
      }
    };
    await batch();
    batching.current = false;
  }, [setMessages, newMsgsCB]);

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
    [ws, userInfo, channel],
  );
  useEffect(() => {
    const ref = ({ data }: MessageEvent<string>) => {
      const cbs: HandleMsgCallbacks = {
        PRIVMSG: (msg) => {
          queue.current.push(msg);
          if (!batching.current) batchMsgs();
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
  }, [ws, channel, batchMsgs]);

  useEffect(() => {
    if (!joined) {
      ws.send(`Join ${channel}`);
    }
  }, [joined, ws, channel]);

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
