import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";
import { usePinnedCtx } from "../../context/pinnedctx.tsx";
import { PinnedChannelMap } from "@/hooks/usePinned.ts";

function Collapsed({
  pinned,
  onClick,
}: {
  pinned: PinnedChannelMap;
  onClick?: (stream: Stream) => void;
}) {
  return (
    <>
      {Array.from(pinned.values()).map(({ userInfo, streamInfo }) => {
        return (
          <div
            key={userInfo.id}
            onClick={() => {
              if (streamInfo) {
                onClick?.(streamInfo);
              }
            }}
            className="relative cursor-pointer flex-shrink-0 mb-2"
            title={userInfo.display_name}
          >
            <img
              src={userInfo.profile_image_url}
              alt={userInfo.display_name}
              className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-purple-500 transition-all"
            />
            {streamInfo && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
        );
      })}
    </>
  );
}

function Uncollapsed({
  pinned,
  removePinned,
  onClick,
}: {
  pinned: PinnedChannelMap;
  removePinned: (login: string) => void;
  onClick?: (stream: Stream) => void;
}) {
  return (
    <>
      <div className="py-3 px-2 border-t border-zinc-700">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
          Pinned Channels
        </h2>
      </div>
      {Array.from(pinned.values()).map(({ userInfo, streamInfo }) => {
        return (
          <div
            key={userInfo.id}
            onClick={() => {
              if (streamInfo) onClick?.(streamInfo);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
          >
            <div className="relative flex-shrink-0">
              <img
                src={userInfo.profile_image_url}
                alt={userInfo.display_name}
                className="w-9 h-9 rounded-full object-cover"
              />
              {streamInfo && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900" />
              )}
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePinned(userInfo.login);
                }}
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Unpin channel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-red-400"
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
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-zinc-100 text-sm font-medium truncate">
                {userInfo.display_name}
              </p>
              {streamInfo && (
                <p className="text-zinc-400 text-xs truncate">
                  {streamInfo.game_name}
                </p>
              )}
            </div>
            {streamInfo && (
              <div className="flex-shrink-0 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span className="text-zinc-400 text-xs">
                  {streamInfo.viewer_count >= 1000
                    ? `${(streamInfo.viewer_count / 1000).toFixed(1)}K`
                    : streamInfo.viewer_count.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

type Props = {
  collapsed: boolean;
  onClick: (stream: Stream) => void;
};

export function PinnedChannels({ collapsed, onClick }: Props) {
  const { pinned, removePinned } = usePinnedCtx();
  if (pinned.size === 0) return null;

  return (
    <div>
      {collapsed ? (
        <>
          <div className="w-8 border-t border-zinc-700 my-2" />
          <Collapsed pinned={pinned} onClick={onClick} />
        </>
      ) : (
        <Uncollapsed
          pinned={pinned}
          removePinned={removePinned}
          onClick={onClick}
        />
      )}
    </div>
  );
}
