import { useState } from "react";
import { PinnedChannelModal } from "./PinnedChannelModal.tsx";
import { FollowerChannels } from "./FollowerChannels.tsx";
import { PinnedChannels } from "./PinnedChannels.tsx";
import { usePinned } from "@Chatter/hooks/usePinned.ts";
import type { Stream } from "@/lib/twitch_api/twitch_api_types.ts";

type Props = {
  onBroadcastAll?: () => void;
  onChannelClick?: (stream: Stream) => void;
};

export function StreamSidebar({ onBroadcastAll, onChannelClick }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [pinnedModalOpen, setPinnedModalOpen] = useState(false);

  const { addPinned, pinned, removePinned, checkPinnedLive } = usePinned();

  return (
    <aside
      className={`h-full bg-zinc-900 border-r border-zinc-700 flex flex-col flex-shrink-0 transition-all duration-200 ${
        collapsed ? "w-14" : "w-64"
      }`}
    >
      <div
        className={`py-3 border-b border-zinc-700 flex items-center ${
          collapsed ? "justify-center px-1" : "justify-between px-2"
        }`}
      >
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
            className={`w-4 h-4 transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
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

      <div
        className={`flex-1 overflow-y-auto ${
          collapsed ? "flex flex-col items-center py-2 gap-2" : ""
        }`}
      >
        <FollowerChannels collapsed={collapsed} onClick={onChannelClick} />
        <PinnedChannels
          pinned={pinned}
          removePinned={removePinned}
          collapsed={collapsed}
          checkPinnedLive={checkPinnedLive}
        />
      </div>

      {collapsed ? (
        <div className="border-t border-zinc-700 flex flex-col items-center py-2 gap-2">
          {/*<button
              type="button"
              onClick={onBroadcastAll}
              className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Broadcast All"
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
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9z" />
              </svg>
            </button>*/}
          <button
            type="button"
            onClick={() => setPinnedModalOpen(true)}
            className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Pin Channel"
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="border-t border-zinc-700">
          <div className="px-4 py-3">
            <button
              type="button"
              onClick={() => setPinnedModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm font-medium py-2 rounded transition-colors cursor-pointer"
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Pin Channel
            </button>
          </div>
          {/*<div className="px-4 py-3 border-t border-zinc-700">
              <button
                type="button"
                onClick={onBroadcastAll}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded transition-colors cursor-pointer"
              >
                Broadcast All
              </button>
            </div>*/}
        </div>
      )}

      <PinnedChannelModal
        open={pinnedModalOpen}
        onClose={() => setPinnedModalOpen(false)}
        addPinned={addPinned}
      />
    </aside>
  );
}
