import { useEffect, useState } from "react";
import { TwitchIRC } from "../lib/irc/irc.ts";
import { useTwitchCtx } from "../context/twitchctx.tsx";

export type IRCConnectionState = "disconnected" | "pending" | "authenticated";

export function useTwitchIRC(): [TwitchIRC | null, IRCConnectionState] {
  const [twitchIRC, setTwitchIRC] = useState<TwitchIRC | null>(null);
  const [connectionState, setConnectionState] = useState<IRCConnectionState>(
    "disconnected",
  );

  const { oauth, twitchAPI } = useTwitchCtx();

  useEffect(() => {
    if (
      !twitchIRC && oauth.validated && oauth.token && twitchAPI
    ) {
      const irc = new TwitchIRC(oauth.token, twitchAPI.userInfo.login);
      setTwitchIRC(irc);
    }
  }, [oauth, twitchAPI, twitchIRC]);

  useEffect(() => {
    if (!twitchIRC) return;
    (async () => {
      try {
        setConnectionState("pending");
        await twitchIRC.connect();
        setConnectionState("authenticated");
      } catch (err) {
        console.error(err);
      }
    })();

    return function () {
      console.log("RAN RAN RAN");
      if (twitchIRC) {
        console.log("disconnected");
        twitchIRC.disconnect();
      }
    };
  }, [twitchIRC]);

  return [twitchIRC, connectionState];
}
