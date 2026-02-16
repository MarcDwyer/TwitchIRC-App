import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar.tsx";
import { StreamSidebar } from "@/components/StreamSidebar/index.tsx";
import { TwitchViewer } from "./components/TwitchViewer/index.tsx";
import { useViewing } from "./context/chatterctx.tsx";
import { useTwitchReady } from "../../hooks/useTwitchReady.ts";

export function Chatter() {
  const [_, setBroadcastOpen] = useState(false);
  const { viewing, addViewing } = useViewing();
  const userInfo = useTwitchReady().twitchAPI.userInfo;

  useEffect(() => {
    if (userInfo) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = userInfo.profile_image_url;
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar>
        <div className="flex items-center gap-3">
          {userInfo && (
            <img
              src={userInfo.profile_image_url}
              alt={userInfo.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>Welcome {userInfo?.display_name}</span>
        </div>
      </Navbar>
      <div className="flex flex-nowrap flex-1 min-h-0 w-full">
        <StreamSidebar
          onBroadcastAll={() => setBroadcastOpen(true)}
          onChannelClick={addViewing}
        />
        <main className="w-full h-full bg-zinc-800 overflow-y-scroll p-2">
          {viewing.size === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500">
                Select a channel from the sidebar to join
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-1 h-full ${(() => {
                const count = viewing.size;
                const cols = Math.min(count, 3);
                const rows = Math.ceil(count / 3);
                // Tailwind needs full class strings — no dynamic interpolation
                const colClasses = [
                  "grid-cols-1",
                  "grid-cols-2",
                  "grid-cols-3",
                ] as const;
                const rowClasses = ["grid-rows-1", "grid-rows-2"] as const;
                const colClass = colClasses[cols - 1];
                if (rows <= 2) {
                  return `${colClass} ${rowClasses[rows - 1]}`;
                }
                return `${colClass} auto-rows-[50%] overflow-y-auto`;
              })()}`}
            >
              {Array.from(viewing.values()).map((stream) => (
                <TwitchViewer key={stream.id} stream={stream} />
              ))}
            </div>
          )}
        </main>
      </div>
      {/*<BroadcastModal
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onSend={() => {}}
      />*/}
    </div>
  );
}
