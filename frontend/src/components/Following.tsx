import { useState } from "react";
import { useFollowing } from "../hooks/useFollowing.ts";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";

type Props = {
  onClick?: (stream: Stream) => void;
};

export function Following({ onClick }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  const following = useFollowing();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-100">
          Following Streams {following && `(${following.length})`}
        </h2>
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="px-3 py-1.5 text-sm bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded transition-colors"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
      {isVisible && (
        <div className="max-h-144 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {following &&
              following.length > 0 &&
              following.map((stream) => (
                <div
                  key={stream.id}
                  className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                  <a
                    href={`https://twitch.tv/${stream.user_login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative">
                      <img
                        src={stream.thumbnail_url
                          .replace("{width}", "440")
                          .replace("{height}", "248")}
                        alt={stream.user_name}
                        className="w-full aspect-video object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                        LIVE
                      </span>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                        {stream.viewer_count.toLocaleString()} viewers
                      </span>
                    </div>
                  </a>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-zinc-100 font-semibold truncate">
                        {stream.user_name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onClick?.(stream)}
                        className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                        title={`Join ${stream.user_name}'s chat`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-zinc-400 text-sm truncate">
                      {stream.title}
                    </p>
                    <p className="text-zinc-500 text-sm truncate">
                      {stream.game_name}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
