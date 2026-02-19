import { ChannelCard } from "@/components/ChannelCard";
import { usePinnedCtx } from "@/context/pinnedctx";
import { useDebounceLLM } from "@/hooks/useDebounce";
import { useTwitchReady } from "@/hooks/useTwitchReady";
import { ChannelAPI } from "@/lib/twitch_api/twitch_api_types";
import { useState } from "react";

export function Browse() {
  const { twitchAPI } = useTwitchReady();
  const { pinned, addPinnedFromLogin } = usePinnedCtx();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<ChannelAPI[]>([]);
  const search = () => {
    if (!query.length) return;
    console.log("search here...");
    twitchAPI.searchChannels(query, 20).then(setResults);
  };
  useDebounceLLM(query, search);
  console.log({ results });
  return (
    <div className=" h-full w-full overflow-y-auto flex flex-col">
      <form className="w-1/2 border ml-auto mr-auto mt-2">
        <input
          className="bg-zinc-900 p-1.5 w-full h-full rounded-md text-white"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search channel"
        />
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        {results.map((channel, i) => (
          <ChannelCard
            channel={channel}
            key={i}
            isPinned={pinned.has(channel.broadcaster_login)}
            onClick={(channel) => addPinnedFromLogin(channel.broadcaster_login)}
          />
        ))}
      </div>
    </div>
  );
}
