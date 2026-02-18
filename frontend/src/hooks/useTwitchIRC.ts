import { useCallback, useEffect, useState } from "react";
import { handleMessage } from "../util/handleMessage.ts";
import { UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";

export type IRCConnectionState = "disconnected" | "pending" | "authenticated";

export function useTwitchIRC(): [WebSocket | null, IRCConnectionState] {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<IRCConnectionState>("disconnected");

  const connect = useCallback(
    (token: string, userInfo: UserInfo) => {
      const tmpWs = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
      tmpWs.onopen = () => {
        if (!token || !userInfo) {
          throw new Error("No token or twitchAPI not created");
        }
        setStatus("pending");
        tmpWs.send(
          "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership",
        );
        tmpWs.send(`PASS oauth:${token}`);
        tmpWs.send(`NICK ${userInfo.login}`);

        setWs(tmpWs);
      };
    },
    [setWs, setStatus],
  );

  useEffect(() => {
    if (!ws) {
      return;
    }
    ws.addEventListener("message", ({ data }: MessageEvent<string>) =>
      handleMessage({
        data,
        cbs: {
          "001": () => setStatus("authenticated"),
          PING: () => ws.send("PONG :tmi.twitch.tv"),
        },
      }),
    );
    ws.addEventListener("error", (err) => {
      console.error("WebSocket error:", err);
    });
    ws.addEventListener("close", (err) => {
      console.log("IRC:", { err });
      setStatus("disconnected");
    });
  }, [ws, connect]);
  return [ws, status];
}
