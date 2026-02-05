import { useEffect, useState } from "react";
import { useFollowing } from "../hooks/useFollowing.ts";
import { Channel, ChatMessageEvent } from "../lib/irc/channel.ts";
import { useTwitchIRC } from "../hooks/useTwitchIRC.ts";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";

type FollowingChannels = {
  channel: Channel;
  stream: Stream;
  messages: ChatMessageEvent[];
};
export function Joined() {
  const [channels, setChannels] = useState<Map<string, FollowingChannels>>(
    new Map(),
  );
  const following = useFollowing();
  const { twitchIRC } = useTwitchIRC();

  useEffect(() => {
  }, [channels]);

  return <div></div>;
}
