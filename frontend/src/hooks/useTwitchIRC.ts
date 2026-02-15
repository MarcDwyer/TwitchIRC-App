import { useCallback, useEffect, useState } from "react";
import { handleMessage } from "../util/handleMessage.ts";
import { TwitchAPI } from "../lib/twitch_api/twitch_api.ts";

export type IRCConnectionState = "disconnected" | "pending" | "authenticated";

export function useTwitchIRC(twitchAPI: TwitchAPI, token: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<IRCConnectionState>("disconnected");

  const connect = useCallback(() => {
    const tmpWs = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
    tmpWs.onopen = () => {
      if (!token || !twitchAPI) {
        throw new Error("No token or twitchAPI not created");
      }
      setStatus("pending");
      tmpWs.send(
        "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership",
      );
      tmpWs.send(`PASS oauth:${token}`);
      tmpWs.send(`NICK ${twitchAPI.userInfo.login}`);

      setWs(tmpWs);
    };
  }, [setWs, token, twitchAPI, setStatus]);

  useEffect(() => {
    if (!ws) {
      return;
    }
    ws.addEventListener(
      "message",
      ({ data }: MessageEvent<string>) =>
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

  useEffect(() => {
    if (status === "disconnected") connect();
  }, [connect, status]);
  return ws;
}
