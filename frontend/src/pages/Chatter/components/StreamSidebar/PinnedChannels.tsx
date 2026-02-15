import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";

function Collapsed(
  { pinned, checkPinnedLive }: {
    pinned: Map<string, UserInfo>;
    checkPinnedLive: (login: string) => Stream | undefined;
  },
) {
  return (
    <>
      {Array.from(pinned.values()).map((user) => {
        const live = checkPinnedLive(user.login);
        return (
          <button
            key={user.id}
            type="button"
            onClick={() => {}}
            className="relative cursor-pointer flex-shrink-0"
            title={user.display_name}
          >
            <img
              src={user.profile_image_url}
              alt={user.display_name}
              className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-purple-500 transition-all"
            />
            {live && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900" />
            )}
          </button>
        );
      })}
    </>
  );
}

function Uncollapsed(
  { pinned, removePinned, checkPinnedLive }: {
    pinned: Map<string, UserInfo>;
    removePinned: (login: string) => void;
    checkPinnedLive: (login: string) => Stream | undefined;
  },
) {
  return (
    <>
      <div className="py-3 px-2 border-t border-zinc-700">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
          Pinned Channels
        </h2>
      </div>
      {Array.from(pinned.values()).map((user) => {
        const live = checkPinnedLive(user.login);
        return (
          <button
            key={user.id}
            type="button"
            onClick={() => {}}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profile_image_url}
                alt={user.display_name}
                className="w-9 h-9 rounded-full object-cover"
              />
              {live && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-900" />
              )}
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePinned(user.login);
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
                {user.display_name}
              </p>
              {live && (
                <p className="text-zinc-400 text-xs truncate">
                  {live.game_name}
                </p>
              )}
            </div>
            {live && (
              <div className="flex-shrink-0 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span className="text-zinc-400 text-xs">
                  {live.viewer_count >= 1000
                    ? `${(live.viewer_count / 1000).toFixed(1)}K`
                    : live.viewer_count.toLocaleString()}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </>
  );
}

type Props = {
  collapsed: boolean;
  pinned: Map<string, UserInfo>;
  removePinned: (user: string) => void;
  checkPinnedLive: (login: string) => Stream | undefined;
};

export function PinnedChannels(
  { collapsed, pinned, checkPinnedLive, removePinned }: Props,
) {
  if (pinned.size === 0) return null;

  if (collapsed) {
    return <Collapsed pinned={pinned} checkPinnedLive={checkPinnedLive} />;
  }
  console.log({ pinned });
  return (
    <Uncollapsed
      pinned={pinned}
      removePinned={removePinned}
      checkPinnedLive={checkPinnedLive}
    />
  );
}
