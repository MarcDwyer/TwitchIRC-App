import { UserInfo } from "../../lib/twitch_api/twitch_api_types.ts";

type Props = {
  pinned: Map<string, UserInfo>;
  collapsed: boolean;
  onClick?: (user: UserInfo) => void;
  onRemove?: (login: string) => void;
};

export function PinnedChannels(
  { pinned, collapsed, onClick, onRemove }: Props,
) {
  if (pinned.size === 0) return null;

  if (collapsed) {
    return (
      <>
        {Array.from(pinned.values()).map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => onClick?.(user)}
            className="relative cursor-pointer flex-shrink-0"
            title={user.display_name}
          >
            <img
              src={user.profile_image_url}
              alt={user.display_name}
              className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-purple-500 transition-all"
            />
          </button>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="py-3 px-2 border-t border-zinc-700">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
          Pinned Channels
        </h2>
      </div>
      {Array.from(pinned.values()).map((user) => (
        <button
          key={user.id}
          type="button"
          onClick={() => onClick?.(user)}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-zinc-800 transition-colors cursor-pointer text-left group"
        >
          <div className="relative flex-shrink-0">
            <img
              src={user.profile_image_url}
              alt={user.display_name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(user.login);
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
          </div>
        </button>
      ))}
    </>
  );
}
