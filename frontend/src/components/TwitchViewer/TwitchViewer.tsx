import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { BroadcastHandler } from "../../pages/Dashboard/Dashboard.tsx";
import { Chat } from "./Chat.tsx";
import { StreamInfo } from "./StreamInfo.tsx";
import { useMemo } from "react";

type Props = {
  stream: Stream;
  ws: WebSocket | null;
  part: (stream: Stream, channel: string) => void;
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
};
export function TwitchViewer({ stream, part, ws, broadcastHandlers }: Props) {
  const channel = useMemo(() => `#${stream.user_login}`, [stream]);
  const embedUrl =
    `https://player.twitch.tv/?channel=${stream.user_login}&parent=${location.hostname}`;
  return (
    <div className="flex flex-col h-full basis-[calc(33.333%-0.25rem)] bg-zinc-800 rounded-lg border border-zinc-700">
      <div className="relative w-full aspect-video shrink-0 overflow-hidden max-h-180">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          title={`${stream.user_name}'s stream`}
        />
        <button
          type="button"
          onClick={() => part(stream, channel)}
          className="z-20 absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded p-1 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="absolute bottom-1 right-1 pointer-events-none text-zinc-400/60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22 22H20V20H22V22ZM22 18H18V20H16V22H22V18ZM22 14H20V16H22V14Z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        <StreamInfo stream={stream} />
        {ws && (
          <Chat
            ws={ws}
            channel={channel}
            broadcastHandlers={broadcastHandlers}
            stream={stream}
          />
        )}
      </div>
    </div>
  );
}
