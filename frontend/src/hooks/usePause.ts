import { useEffect, useRef, useState } from "react";
import { IrcMessage } from "../types/twitch_data.ts";

export function usePause(messages: IrcMessage[]) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const resizingRef = useRef(false);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      resizingRef.current = true;
      requestAnimationFrame(() => {
        resizingRef.current = false;
        if (!paused && el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [paused]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el || paused) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, paused]);

  function handleScroll() {
    if (resizingRef.current) return;
    const el = chatRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setPaused(distanceFromBottom > 30);
  }

  function resumeChat() {
    setPaused(false);
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  return { chatRef, paused, handleScroll, resumeChat };
}
