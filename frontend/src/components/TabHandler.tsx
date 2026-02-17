import { Tab } from "../App.tsx";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { StreamSidebar } from "./StreamSidebar/index.tsx";
import { Chatter } from "@Chatter/index.tsx";
import { Discovery } from "../pages/Discovery/index.tsx";
import { useViewing } from "@Chatter/context/chatterctx.tsx";

type Props = {
  tab: Tab;
  setTab: React.Dispatch<React.SetStateAction<Tab>>;
};

export function TabHandler({ tab, setTab }: Props) {
  const { addViewing } = useViewing();

  const onStreamClick = (stream: Stream) => {
    if (tab !== "chatter") {
      setTab("chatter");
    }
    addViewing(stream);
  };
  return (
    <>
      <StreamSidebar onChannelClick={onStreamClick} />
      {tab === "chatter" ? <Chatter /> : <Discovery />}
    </>
  );
}
