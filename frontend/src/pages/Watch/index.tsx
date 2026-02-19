import { useWatchCtx } from "@/pages/Watch/context/watchctx";
import { useChat } from "@/hooks/useChat.ts";
import { Chat } from "@/components/Chat.tsx";

export function Watch() {
  const { selected } = useWatchCtx();

  if (!selected) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        No stream selected
      </div>
    );
  }

  const channel = `#${selected.user_login}`;
  const playerUrl = `https://player.twitch.tv/?channel=${selected.user_login}&parent=${location.hostname}`;

  return (
    <WatchStream
      playerUrl={playerUrl}
      channel={channel}
      userName={selected.user_name}
    />
  );
}

function WatchStream({
  playerUrl,
  channel,
  userName,
}: {
  playerUrl: string;
  channel: string;
  userName: string;
}) {
  return (
    <div className="flex h-full w-full gap-2 bg-zinc-800">
      <div className="flex-1 min-w-0">
        <iframe
          src={playerUrl}
          className="w-full h-full rounded-lg"
          allowFullScreen
          title={`${userName}'s stream`}
        />
      </div>
      <div className="w-85 shrink-0">
        <Chat channel={channel} />
      </div>
    </div>
  );
}
