import { Chatter } from "./pages/Chatter/index.tsx";
import { useTwitchCtx } from "./context/twitchctx.tsx";
import { ClientIDPage } from "./pages/ClientID.tsx";
import { OAuthPage } from "./pages/OAuth.tsx";
import { ChatterCtxProvider } from "./pages/Chatter/context/chatterctx.tsx";
import { useEffect, useState } from "react";
import { createTwitchAPI, TwitchAPI } from "./lib/twitch_api/twitch_api.ts";

function App() {
  const [twitchAPI, setTwitchAPI] = useState<null | TwitchAPI>(null);
  const twitch = useTwitchCtx();

  useEffect(() => {
    if (
      twitch.clientID &&
      twitch.oauth.validated &&
      twitch.oauth.token &&
      !twitchAPI
    ) {
      createTwitchAPI(twitch.clientID, twitch.oauth.token).then(setTwitchAPI);
    }
  }, [twitch, twitchAPI]);

  if (!twitch.clientID) {
    return <ClientIDPage />;
  }
  if (twitch.clientID && !twitch.oauth.validated) {
    return <OAuthPage />;
  }

  if (!twitchAPI) {
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
    <ChatterCtxProvider
      twitchAPI={twitchAPI}
      token={twitch.oauth.token as string}
      clientID={twitch.clientID}
    >
      <Chatter />
    </ChatterCtxProvider>
  );
}

export default App;
