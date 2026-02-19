import { useCallback, useEffect, useRef, useState } from "react";
import { handleMessage, HandleMsgCallbacks } from "@/util/handleMessage.ts";
import { createIRCMessage } from "@Chatter/util/createIRCMessage.ts";
import { IrcMessage } from "@/types/twitch_data.ts";
import { useTwitchReady } from "./useTwitchReady.ts";
import { useMessages } from "./useMessages.ts";
import { useChatters } from "./useChatters.ts";

const addUserState = (msg: IrcMessage, userState: IrcMessage | null) => {
  if (!userState) return msg;
  Object.assign(msg, { tags: userState.tags });
};

export function useChat(channel: string) {
  const { ws } = useTwitchReady();
  const [joined, setJoined] = useState<boolean>(false);

  const userInfo = useTwitchReady().twitchAPI.userInfo;

  const { addChatter, chatters, reset: resetChatters } = useChatters(channel);

  const {
    messages,
    handleMessage: handlePrivMsg,
    addMessage,
    reset: resetMessages,
  } = useMessages(channel);

  const userState = useRef<IrcMessage | null>(null);

  const send = useCallback(
    (msg: string) => {
      if (!userInfo || !ws) return;
      const ircMsg = createIRCMessage(
        msg,
        channel,
        userInfo.display_name ?? "",
      );
      addUserState(ircMsg, userState.current);
      addMessage(ircMsg);
      ws.send(`PRIVMSG ${channel} :${msg}`);
    },
    [ws, userInfo, channel],
  );
  useEffect(() => {
    if (!ws) return;
    const ref = ({ data }: MessageEvent<string>) => {
      const cbs: HandleMsgCallbacks = {
        PRIVMSG: (msg) => {
          addChatter(msg);
          handlePrivMsg(msg);
        },
        USERSTATE: (ircMsg) => {
          userState.current = ircMsg;
        },
        JOIN: () => {
          setJoined(true);
        },
        NOTICE: (msg) => {
          msg.username = "NOTICE";
          console.log({ msg });
          addMessage(msg);
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
  }, [ws, channel, handlePrivMsg]);

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
    return function () {
      const msg = `PART ${channel}`;
      console.log({ msg });
      ws.send(msg);
      resetMessages();
      resetChatters();
    };
  }, [ws, channel]);

  return {
    channel,
    messages,
    joined,
    send,
    isMentioned,
    chatters,
  };
}
