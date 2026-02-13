import { useCallback, useState } from "react";

export function useAsync<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { execute, loading, error };
}
