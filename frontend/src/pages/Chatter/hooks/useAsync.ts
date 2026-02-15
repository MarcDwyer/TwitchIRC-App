import { useCallback, useState } from "react";

export function useAsync<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setLoading(true);
      try {
        const result = await fn(...args);
        setError(null);
        return result;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { execute, loading, error, setError };
}
