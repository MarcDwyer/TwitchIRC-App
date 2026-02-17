import { StreamCard } from "@/components/StreamCard.tsx";
import { useTopStreams } from "../hooks/useTopStreams.ts";
import { useEffect } from "react";
import { TopStreamsSkeleton } from "./TopStreamsSkeleton.tsx";
import { usePinnedCtx } from "../../../context/pinnedctx.tsx";

export function TopStreams() {
  const { streams, fetchNextPage } = useTopStreams(20);
  const { addPinnedFromStream, pinned, removePinned } = usePinnedCtx();

  useEffect(() => {
    if (!streams) fetchNextPage();
  }, [streams, fetchNextPage]);

  if (!streams) {
    return <TopStreamsSkeleton />;
  }
  return (
    <div className="flex flex-col gap-4 bg-zinc-800 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {streams.map((stream, i) => {
          const isPinned = pinned.has(stream.user_login);
          return (
            <StreamCard
              stream={stream}
              key={i}
              isPinned={isPinned}
              onClick={(str) => {
                if (isPinned) {
                  removePinned(str.user_login);
                } else {
                  addPinnedFromStream(str);
                }
              }}
            />
          );
        })}
      </div>
      <button
        onClick={fetchNextPage}
        className="self-center px-6 py-2 text-sm font-medium text-purple-400 hover:text-white bg-zinc-800 hover:bg-purple-600 border border-zinc-700 hover:border-purple-600 rounded-lg transition-all cursor-pointer"
      >
        Load more
      </button>
    </div>
  );
}
