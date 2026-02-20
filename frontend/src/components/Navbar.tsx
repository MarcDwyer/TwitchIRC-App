import { AppTab, WatchView } from "@/App.tsx";
import { LogoutBtn } from "./LogoutBtn.tsx";
import { useTwitchReady } from "@/hooks/useTwitchReady.ts";
import { LayoutGrid, Square } from "lucide-react";

const discoverTabs: { value: AppTab; display: string }[] = [
  { value: "top_streams", display: "Top Streams" },
  { value: "browse", display: "Browse" },
];

type Props = {
  appTab: AppTab;
  setAppTab: (tab: AppTab) => void;
  watchView: WatchView;
  setWatchView: React.Dispatch<React.SetStateAction<WatchView>>;
};
export function Navbar({ appTab, setAppTab, watchView, setWatchView }: Props) {
  const { twitchAPI } = useTwitchReady();
  const userInfo = twitchAPI.userInfo;

  const renderTab = ({
    value,
    display,
  }: {
    value: AppTab;
    display: string;
  }) => (
    <button
      key={value}
      type="button"
      onClick={() => setAppTab(value)}
      className={`capitalize px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
        appTab === value
          ? "bg-purple-600 text-white"
          : "text-zinc-400 hover:text-zinc-100"
      }`}
    >
      {display}
    </button>
  );

  return (
    <header className="flex h-14 justify-between items-center px-6 py-2 bg-zinc-800 border-b border-zinc-700">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-zinc-100">
          <div className="flex items-center gap-3">
            <img
              src={userInfo.profile_image_url}
              alt={userInfo.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </h1>
      </div>
      <nav className="flex gap-1 bg-zinc-900 rounded-lg p-1">
        {appTab === "watch" && (
          <>
            <button
              onClick={() => setWatchView("grid")}
              type="button"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${watchView === "grid" ? "text-purple-400 bg-purple-500/20 shadow-[0_0_8px_2px_rgba(168,85,247,0.3)]" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setWatchView("single")}
              type="button"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${watchView === "single" ? "text-purple-400 bg-purple-500/20 shadow-[0_0_8px_2px_rgba(168,85,247,0.3)]" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"}`}
            >
              <Square className="w-5 h-5" />
            </button>
            <div className="w-px bg-zinc-700 mx-1" />
          </>
        )}
        {renderTab({ value: "watch", display: "Watch" })}
        <div className="w-px bg-zinc-700 mx-1" />
        {discoverTabs.map(renderTab)}
      </nav>
      <LogoutBtn />
    </header>
  );
}
