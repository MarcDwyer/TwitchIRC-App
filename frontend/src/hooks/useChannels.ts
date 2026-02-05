import { useEffect, useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { Channel } from "../lib/irc/channel.ts";
import { TwitchIRC } from "../lib/irc/irc.ts";

type UseChannelsProps = {
  twitchIRC: TwitchIRC | null;
  following: Stream[] | null;
};

export function useChannels({ twitchIRC, following }: UseChannelsProps) {
  const [channels, setChannels] = useState<Map<string, Channel>>(new Map());

  useEffect(() => {
    if (!twitchIRC || !following) return;

    for (const follow of following) {
      const username = follow.user_name.toLowerCase();
      if (channels.has(username)) continue;
      twitchIRC.join(username);
    }

    twitchIRC.addEventListener("onjoin", ({ channel, channelName }) => {
      const name = channelName.replace("#", "");
      setChannels((prev) => new Map(prev).set(name, channel));
    });
  }, [twitchIRC, following]);

  return channels;
}
