import { AppTab } from "@/App.tsx";
import { LogoutBtn } from "./LogoutBtn.tsx";
import { useTwitchReady } from "@/hooks/useTwitchReady.ts";

type Props = {
  appTab: AppTab;
  setAppTab: (tab: AppTab) => void;
};

export function Navbar({ appTab, setAppTab }: Props) {
  const { twitchAPI } = useTwitchReady();
  const userInfo = twitchAPI.userInfo;
  const apps: AppTab[] = ["watch", "chatter", "discovery"];
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
        {apps.map((app) => (
          <button
            key={app}
            type="button"
            onClick={() => setAppTab(app)}
            className={`capitalize px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              appTab === app.toLowerCase()
                ? "bg-purple-600 text-white"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {app}
          </button>
        ))}
      </nav>
      <LogoutBtn />
    </header>
  );
}
