import { useState } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";

type Props = {
  streams: Stream[] | null;
  onClick?: (stream: Stream) => void;
  onBroadcastAll?: () => void;
  onJoinAll?: () => void;
};

export function StreamSidebar({ streams, onClick, onBroadcastAll, onJoinAll }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-full bg-zinc-900 border-r border-zinc-700 flex flex-col flex-shrink-0 transition-all duration-200 ${collapsed ? "w-14" : "w-64"}`}
    >
      <div className={`py-3 border-b border-zinc-700 flex items-center ${collapsed ? "justify-center px-1" : "justify-between px-2"}`}>
        {!collapsed && (
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
            Followed Channels
          </h2>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {collapsed ? (
        <>
          <div className="flex-1 overflow-y-auto flex flex-col items-center py-2 gap-2">
            {streams === null
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse flex-shrink-0"
                  />
                ))
              : streams.map((stream) => (
                  <button
                    key={stream.id}
                    type="button"
                    onClick={() => onClick?.(stream)}
                    className="relative cursor-pointer flex-shrink-0"
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
          </div>
          {streams && streams.length > 0 && onJoinAll && (
            <div className="border-t border-zinc-700 flex flex-col items-center py-2 gap-2">
              <button
                type="button"
                onClick={onBroadcastAll}
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Broadcast All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onJoinAll}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Join All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {streams === null ? (
              Array.from({ length: 6 }).map((_, i) => (
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
              ))
            ) : (
              <>
                {streams.length === 0 && (
                  <p className="text-zinc-500 text-sm px-4 py-3">
                    No live channels
                  </p>
                )}
                {streams.map((stream) => (
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
                      <p className="text-zinc-400 text-xs truncate">
                        {stream.game_name}
                      </p>
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
            )}
          </div>
          {streams && streams.length > 0 && onJoinAll && (
            <div className="border-t border-zinc-700">
              <div className="px-4 py-3">
                <button
                  type="button"
                  onClick={onBroadcastAll}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded transition-colors cursor-pointer"
                >
                  Broadcast All
                </button>
              </div>
              <div className="px-4 py-3 border-t border-zinc-700">
                <button
                  type="button"
                  onClick={onJoinAll}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded transition-colors cursor-pointer"
                >
                  Join All
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
