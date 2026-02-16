import { Tab } from "../App.tsx";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { StreamSidebar } from "./StreamSidebar/index.tsx";
import { Chatter } from "@Chatter/index.tsx";
import { Discovery } from "../pages/Discovery/index.tsx";
import { useViewing } from "@Chatter/context/chatterctx.tsx";

type Props = {
  tab: Tab;
};

export function TabHandler({ tab }: Props) {
  const { addViewing } = useViewing();

  const onStreamClick = (stream: Stream) => {
    if (tab === "chatter") {
      addViewing(stream);
      // also shit
    }
  };
  return (
    <>
      <StreamSidebar onChannelClick={onStreamClick} />
      {tab === "chatter" ? <Chatter /> : <Discovery />}
    </>
  );
}
