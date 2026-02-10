import { useEffect, useRef, useState } from "react";
import { IrcMessage } from "../types/twitch_data.ts";

export function usePause(messages: IrcMessage[]) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = chatRef.current;
    if (!el || paused) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, paused]);

  function handleScroll() {
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
