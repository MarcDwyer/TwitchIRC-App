import { useCallback, useState } from "react";
import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchReady } from "@/hooks/useTwitchReady.ts";

export function useTopStreams(first: number = 20) {
  const { twitchAPI } = useTwitchReady();
  const [streams, setStreams] = useState<Stream[] | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const fetchNextPage = useCallback(async () => {
    try {
      const result = await twitchAPI.getTopStreams(first, cursor);
      console.log({ result });
      setCursor(result.cursor);
      setStreams([...(streams ?? []), ...result.data]);
    } catch (e) {
      console.error(e);
    }
  }, [twitchAPI, first, cursor]);

  return { streams, fetchNextPage };
}
