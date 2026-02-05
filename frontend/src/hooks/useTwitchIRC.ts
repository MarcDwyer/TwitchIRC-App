import { useEffect, useState } from "react";
import { TwitchIRC } from "../lib/irc/irc.ts";
import { useTwitchCtx } from "../context/twitchctx.tsx";

type IRCConnectionState = "disconnected" | "pending" | "authenticated";

export function useTwitchIRC() {
  const [twitchIRC, setTwitchIRC] = useState<TwitchIRC | null>(null);
  const [connectionState, setConnectionState] = useState<IRCConnectionState>(
    "disconnected",
  );

  const { oauth, twitchAPI } = useTwitchCtx();

  useEffect(() => {
    if (
      !twitchAPI || !oauth.token || twitchIRC ||
      connectionState === "authenticated"
    ) {
      return;
    }

    const irc = new TwitchIRC(oauth.token, twitchAPI.userInfo.login);

    setConnectionState("pending");

    irc.setEventListener("authenticated", () => {
      setConnectionState("authenticated");
      setTwitchIRC(irc);
    });

    irc.connect();

    return () => {
      irc.disconnect();
      setTwitchIRC(null);
      setConnectionState("disconnected");
    };
  }, [oauth.token, twitchAPI, twitchIRC, connectionState]);

  return { twitchIRC, connectionState };
}
