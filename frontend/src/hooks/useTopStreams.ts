import { useCallback, useRef, useState } from "react";
import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchReady } from "./useTwitchReady.ts";

export function useTopStreams(pageSize: number = 20) {
  const { twitchAPI } = useTwitchReady();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | undefined>(undefined);

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await twitchAPI.getTopStreams(pageSize, cursorRef.current);
      cursorRef.current = result.cursor;
      setHasMore(!!result.cursor);
      setStreams((prev) => {
        const combined = [...prev, ...result.data];
        return combined.sort((a, b) => b.viewer_count - a.viewer_count);
      });
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [twitchAPI, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setStreams([]);
    cursorRef.current = undefined;
    setHasMore(true);
    setError(null);
  }, []);

  return { streams, loading, error, hasMore, fetchNextPage, reset };
}
