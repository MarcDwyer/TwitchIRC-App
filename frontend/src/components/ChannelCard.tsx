import { ChannelAPI } from "../lib/twitch_api/twitch_api_types.ts";

type Props = {
  channel: ChannelAPI;
  onClick: (channel: ChannelAPI) => void;
  isPinned: boolean;
};

export function ChannelCard({ channel, onClick, isPinned }: Props) {
  const thumbnail = channel.thumbnail_url
    .replace("{width}", "440")
    .replace("{height}", "248");

  return (
    <div
      onClick={() => onClick(channel)}
      className={`flex flex-col rounded-lg overflow-hidden border transition-all cursor-pointer group ${
        isPinned
          ? "border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          : "border-zinc-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5"
      }`}
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={channel.display_name}
          className="w-full aspect-video object-cover"
        />
        {channel.is_live && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/75 rounded px-1.5 py-0.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-white text-xs font-medium">LIVE</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-zinc-100 text-sm font-medium truncate group-hover:text-purple-400 transition-colors">
            {channel.display_name}
          </span>
          <button
            type="button"
            className={`flex-shrink-0 p-1.5 rounded-full hover:bg-zinc-700 transition-all cursor-pointer ${isPinned ? "text-purple-400" : "text-zinc-500 hover:text-purple-400 group-hover:text-purple-400 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.5)]"}`}
            title="Pin channel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 17v5" />
              <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
            </svg>
          </button>
        </div>
        <p className="text-zinc-400 text-xs truncate">{channel.title}</p>
        <span className="text-zinc-500 text-xs">{channel.game_name}</span>
      </div>
    </div>
  );
}
