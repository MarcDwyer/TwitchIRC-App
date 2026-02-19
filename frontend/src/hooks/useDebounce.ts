import { useEffect, useRef } from "react";

export function useDebounce<T>(value: T, fn: Function) {
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, 1000);
  }, [value, fn]);
}

export function useDebounceLLM<T>(value: T, fn: () => void) {
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, 750);
    return () => clearTimeout(timer.current);
  }, [value]);
}
