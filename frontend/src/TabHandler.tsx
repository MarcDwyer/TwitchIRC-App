import { AppTab, WatchView } from "./App.tsx";
import { Stream } from "./lib/twitch_api/twitch_api_types.ts";
import { StreamSidebar } from "./components/StreamSidebar/index.tsx";
import { TopStreams } from "./pages/TopStreams/index.tsx";
import { Browse } from "./pages/Browse/index.tsx";
import { GridView } from "./components/GridView/index.tsx";
import { SingleView } from "./components/SingleView/index.tsx";
import { useEffect, useRef } from "react";
import { useSingleViewCtx } from "./components/SingleView/context/singleviewctx.tsx";
import { useGridViewCtx } from "./components/GridView/context/gridviewctx.tsx";

type Props = {
  appTab: AppTab;
  setAppTab: React.Dispatch<React.SetStateAction<AppTab>>;
  watchView: WatchView;
};

export function TabHandler({ appTab, setAppTab, watchView }: Props) {
  const { addViewing, viewing } = useGridViewCtx();
  const { setSelected, selected } = useSingleViewCtx();

  const prevView = useRef<WatchView>(watchView);

  const onStreamClick = (stream: Stream) => {
    switch (appTab) {
      case "browse":
      case "top_streams":
        setAppTab("watch");
      case "watch":
        if (watchView === "grid") {
          addViewing(stream);
        } else {
          setSelected(stream);
        }
    }
  };

  useEffect(() => {
    if (prevView.current === watchView) return;
    if (watchView === "single") {
      if (viewing.size) {
        const lastAdded = Array.from(viewing.values())[viewing.size - 1];
        setSelected(lastAdded);
      }
    } else {
      if (selected) {
        addViewing(selected);
      }
    }
    prevView.current = watchView;
  }, [watchView, viewing, selected]);

  return (
    <>
      <StreamSidebar onStreamClick={onStreamClick} />
      <div className="h-full w-full bg-zinc-800">
        {(() => {
          switch (appTab) {
            case "top_streams":
              return <TopStreams />;
            case "watch":
              if (watchView === "grid") {
                return <GridView />;
              }
              return <SingleView />;
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
