import { useEffect, useRef, useState } from "react";
import { useTwitchAPI } from "../hooks/useTwitchAPI.ts";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";

type Props = {
  open: boolean;
  onClose: () => void;
  onPin: (stream: Stream) => void;
};

export function PinnedChannelModal(
  { open, onClose, onPin }: Props,
) {
  const [channel, setChannel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const { streams } = useTwitchAPI();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
    return function () {
      setChannel("");
    };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!channel.trim()) return;
    try {
      setError(null);
      const data = await streams.execute(channel);
      onPin(data[0]);
      onClose();
    } catch (err) {
      if (typeof err === "string") {
        setError(err);
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-zinc-100 text-base font-semibold">
            Pin a Channel
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label
              htmlFor="join-channel"
              className="block text-zinc-400 text-sm mb-1.5"
            >
              Channel name
            </label>
            <input
              id="join-channel"
              ref={inputRef}
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="Enter a channel name..."
              className="w-full bg-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm rounded px-3 py-2 outline-none border border-zinc-700 focus:border-purple-500 transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!channel.trim() || streams.loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
            >
              {streams.loading
                ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )
                : (
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
                )}
              {streams.loading ? "Pinning..." : "Pin Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
