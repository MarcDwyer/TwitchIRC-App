import { useTwitchCtx } from "./context/twitchctx.tsx";
import { ClientIDPage } from "./pages/ClientID.tsx";
import { OAuthPage } from "./pages/OAuth.tsx";
import { ChatterCtxProvider } from "./pages/Chatter/context/chatterctx.tsx";
import { useEffect, useState } from "react";
import { createTwitchAPI } from "./lib/twitch_api/twitch_api.ts";
import { Navbar } from "./components/Navbar.tsx";
import { PinnedProvider } from "@/context/pinnedctx.tsx";
import { TabHandler } from "./TabHandler.tsx";
import { WatchProvider } from "@/pages/Watch/context/watchctx.tsx";

type AppList = { value: AppTab; display: string };

export type AppTab = "chatter" | "top_streams" | "watch" | "browse";

export const appsList: AppList[] = [
  { value: "watch", display: "Watch" },
  { value: "chatter", display: "Chatter" },
  { display: "Top Streams", value: "top_streams" },
  { value: "browse", display: "Browse" },
];
function App() {
  const twitch = useTwitchCtx();
  const [appTab, setAppTab] = useState<AppTab>("top_streams");

  useEffect(() => {
    if (
      twitch.clientID &&
      twitch.oauth.validated &&
      twitch.oauth.token &&
      !twitch.twitchAPI
    ) {
      createTwitchAPI(twitch.clientID, twitch.oauth.token).then(
        twitch.setTwitchAPI,
      );
    }
  }, [twitch]);
  useEffect(() => {
    if (
      twitch.oauth.token &&
      twitch.oauth.validated &&
      twitch.twitchAPI &&
      !twitch.irc.ws
    ) {
      twitch.irc.connect(twitch.oauth.token, twitch.twitchAPI.userInfo);
    }
  }, [twitch]);

  if (!twitch.clientID) {
    return <ClientIDPage />;
  }
  if (twitch.clientID && !twitch.oauth.validated) {
    return <OAuthPage />;
  }

  if (!twitch.twitchAPI || !twitch.irc.ws) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 gap-4">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:150ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-zinc-400 text-sm font-medium">
          Loading profile info
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar appTab={appTab} setAppTab={setAppTab} />
      <div className="flex flex-nowrap flex-1 min-h-0 w-full">
        <PinnedProvider>
          <WatchProvider>
            <ChatterCtxProvider>
              <TabHandler appTab={appTab} setAppTab={setAppTab} />
            </ChatterCtxProvider>
          </WatchProvider>
        </PinnedProvider>
      </div>
    </div>
  );
}

export default App;
