import { useFollowing } from "@/hooks/useFollowing.ts";
import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";

type Props = {
  collapsed: boolean;
  onClick?: (stream: Stream) => void;
};

function Collapsed({
  following,
  onClick,
}: {
  following: Stream[];
  onClick?: (stream: Stream) => void;
}) {
  return (
    <>
      {following.map((stream) => (
        <button
          key={stream.id}
          type="button"
          onClick={() => onClick?.(stream)}
          className="relative cursor-pointer flex-shrink-0 mb-2"
          title={stream.user_name}
        >
          <img
            src={stream.thumbnail_url
              .replace("{width}", "70")
              .replace("{height}", "70")}
            alt={stream.user_name}
            className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-purple-500 transition-all"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900" />
        </button>
      ))}
    </>
  );
}

function Uncollapsed({
  following,
  onClick,
}: {
  following: Stream[];
  onClick?: (stream: Stream) => void;
}) {
  if (following.length === 0) {
    return <p className="text-zinc-500 text-sm px-4 py-3">No live channels</p>;
  }

  return (
    <>
      {following.map((stream) => (
        <button
          key={stream.id}
          type="button"
          onClick={() => onClick?.(stream)}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors cursor-pointer text-left"
        >
          <div className="relative flex-shrink-0">
            <img
              src={stream.thumbnail_url
                .replace("{width}", "70")
                .replace("{height}", "70")}
              alt={stream.user_name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-zinc-100 text-sm font-medium truncate">
              {stream.user_name}
            </p>
            <p className="text-zinc-400 text-xs truncate">{stream.game_name}</p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            <span className="text-zinc-400 text-xs">
              {stream.viewer_count >= 1000
                ? `${(stream.viewer_count / 1000).toFixed(1)}K`
                : stream.viewer_count.toLocaleString()}
            </span>
          </div>
        </button>
      ))}
    </>
  );
}

export function FollowerChannels({ collapsed, onClick }: Props) {
  const following = useFollowing();

  if (following === null) {
    if (collapsed) {
      return (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse flex-shrink-0"
            />
          ))}
        </>
      );
    }

    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full flex items-center gap-3 px-4 py-2 animate-pulse"
          >
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-3 w-24 bg-zinc-700 rounded" />
              <div className="h-2.5 w-16 bg-zinc-700 rounded" />
            </div>
            <div className="h-2.5 w-8 bg-zinc-700 rounded flex-shrink-0" />
          </div>
        ))}
      </>
    );
  }

  if (collapsed) {
    return <Collapsed following={following} onClick={onClick} />;
  }

  return <Uncollapsed following={following} onClick={onClick} />;
}
