import { Tabs } from "@/App.tsx";
import { LogoutBtn } from "./LogoutBtn.tsx";
import { useTwitchReady } from "@/hooks/useTwitchReady.ts";

type Props = {
  tab: Tabs;
  onTabChange: (tab: Tabs) => void;
};

export function Navbar({ tab, onTabChange }: Props) {
  const { twitchAPI } = useTwitchReady();
  const userInfo = twitchAPI.userInfo;

  return (
    <header className="flex h-14 justify-between items-center px-6 py-2 bg-zinc-800 border-b border-zinc-700">
      <h1 className="text-lg font-bold text-zinc-100">
        <div className="flex items-center gap-3">
          <img
            src={userInfo.profile_image_url}
            alt={userInfo.display_name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>Welcome {userInfo.display_name}</span>
        </div>
      </h1>
      <nav className="flex gap-1 bg-zinc-900 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onTabChange("chatter")}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === "chatter"
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          Chatter
        </button>
        <button
          type="button"
          onClick={() => onTabChange("discovery")}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === "discovery"
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          Discover
        </button>
      </nav>
      <LogoutBtn />
    </header>
  );
}
