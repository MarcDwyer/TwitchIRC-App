import { AppTab } from "./App.tsx";
import { Stream } from "./lib/twitch_api/twitch_api_types.ts";
import { StreamSidebar } from "./components/StreamSidebar/index.tsx";
import { Chatter } from "@Chatter/index.tsx";
import { useChatterCtx } from "@/pages/Chatter/context/chatterctx.tsx";
import { useWatchCtx } from "@/pages/Watch/context/watchctx.tsx";
import { Watch } from "@/pages/Watch/index.tsx";
import { TopStreams } from "./pages/TopStreams/index.tsx";
import { Browse } from "./pages/Browse/index.tsx";

type Props = {
  appTab: AppTab;
  setAppTab: React.Dispatch<React.SetStateAction<AppTab>>;
};

export function TabHandler({ appTab, setAppTab }: Props) {
  const { addViewing } = useChatterCtx();
  const { setSelected } = useWatchCtx();

  const onStreamClick = (stream: Stream) => {
    switch (appTab) {
      case "chatter":
        addViewing(stream);
        break;
      case "top_streams":
        setAppTab("watch");
      case "watch":
        setSelected(stream);
        break;
    }
  };

  return (
    <>
      <StreamSidebar onStreamClick={onStreamClick} />
      <div className="h-full w-full bg-zinc-800">
        {(() => {
          switch (appTab) {
            case "chatter":
              return <Chatter />;
            case "top_streams":
              return <TopStreams />;
            case "watch":
              return <Watch />;
            case "browse":
              return <Browse />;
            default:
              return <span>App not found</span>;
          }
        })()}
      </div>
    </>
  );
}
