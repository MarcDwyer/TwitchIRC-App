import { AppTab } from "./App.tsx";
import { Stream } from "./lib/twitch_api/twitch_api_types.ts";
import { StreamSidebar } from "./components/StreamSidebar/index.tsx";
import { Chatter } from "@Chatter/index.tsx";
import { Discovery } from "./pages/Discovery/index.tsx";
import { useViewing } from "@Chatter/context/chatterctx.tsx";

type Props = {
  appTab: AppTab;
  setAppTab: React.Dispatch<React.SetStateAction<AppTab>>;
};

export function TabHandler({ appTab, setAppTab }: Props) {
  const { addViewing } = useViewing();

  const onStreamClick = (stream: Stream) => {
    if (appTab !== "chatter") {
      setAppTab("chatter");
    }
    addViewing(stream);
  };
  return (
    <>
      <StreamSidebar onStreamClick={onStreamClick} />
      {(() => {
        switch (appTab) {
          case "chatter":
            return <Chatter />;
          case "discovery":
            return <Discovery />;
          default:
            return <span>App not found</span>;
        }
      })()}
    </>
  );
}
