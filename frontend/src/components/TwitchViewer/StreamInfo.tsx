import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";

type Props = {
  stream: Stream;
};

export function StreamInfo({ stream }: Props) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-y border-zinc-700">
      <div>
        <span className="text-zinc-100 text-sm font-medium">
          {stream.user_name}
        </span>
        <div className="text-xs font-medium">
          <span className="text-red-400 ">
            {stream.viewer_count.toLocaleString() + " "}
          </span>
          <span className="text-white">
            viewers
          </span>
        </div>
      </div>
      <span className="text-zinc-400 text-xs">{stream.game_name}</span>
    </div>
  );
}
