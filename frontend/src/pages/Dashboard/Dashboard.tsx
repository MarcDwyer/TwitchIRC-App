import { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import { Navbar } from "../../components/Navbar.tsx";
import { StreamSidebar } from "../../components/StreamSidebar.tsx";
import { useFollowing } from "../../hooks/useFollowing.ts";
import { Stream } from "../../lib/twitch_api/twitch_api_types.ts";
import { TwitchViewer } from "../../components/TwitchViewer/TwitchViewer.tsx";
import { useTwitchIRC } from "../../hooks/useTwitchIRC.ts";
import { BroadcastModal } from "../../components/BroadcastModal.tsx";
import { useUserInfo } from "../../hooks/useUserInfo.ts";

export type BroadcastHandler = (msg: string) => void;

export function Dashboard() {
  const [viewing, setViewing] = useState<Set<Stream>>(new Set());
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const following = useFollowing();
  const { ws } = useTwitchIRC();
  const userInfo = useUserInfo();

  const broadcastHandlers = useRef<BroadcastHandler[]>([]);

  const broadcast = (msg: string) => {
    if (!userInfo || !ws) return;
    broadcastHandlers.current.forEach((push) => push(msg));
  };

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
          streams={following}
          onClick={(stream) => {
            if (!viewing.has(stream)) {
              setViewing(new Set(viewing).add(stream));
            }
          }}
          onBroadcastAll={() => setBroadcastOpen(true)}
          onJoinAll={() => {
            if (!following) return;
            const viewAll = following.reduce<Set<Stream>>((view, stream) => {
              if (!view.has(stream)) {
                view.add(stream);
              }
              return view;
            }, new Set(viewing));
            setViewing(viewAll);
          }}
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
              className="viewing-grid h-full auto-rows-fr gap-4"
              style={
                { "--count": Math.min(viewing.size, 3) } as React.CSSProperties
              }
            >
              {Array.from(viewing).map((stream) => (
                <div key={stream.id} className="min-w-0">
                  <TwitchViewer
                    stream={stream}
                    ws={ws}
                    broadcastHandlers={broadcastHandlers}
                    part={(stream, channelName) => {
                      const updated = new Set(viewing);
                      updated.delete(stream);
                      setViewing(updated);
                      ws?.send(`PART ${channelName}`);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <BroadcastModal
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
        onSend={broadcast}
      />
    </div>
  );
}

export default Dashboard;
