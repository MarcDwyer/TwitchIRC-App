import { createContext, useState, useContext, type ReactNode } from "react";
import { Stream } from "../lib/twitch_api/twitch_api_types.ts";
import { TwitchAPI } from "../lib/twitch_api/twitch_api.ts";

type FollowingContextType = {
  liveFollowing: Stream[];
  twitchAPI: TwitchAPI | null;
  setTwitchAPI: React.Dispatch<React.SetStateAction<TwitchAPI | null>>;
  setLiveFollowing: React.Dispatch<React.SetStateAction<Stream[]>>;
};

const FollowingContext = createContext<FollowingContextType>({
  liveFollowing: [],
  twitchAPI: null,
  setTwitchAPI: () => {},
  setLiveFollowing: () => {},
});

export const FollowingProvider = ({ children }: { children: ReactNode }) => {
  const [liveFollowing, setLiveFollowing] = useState<Stream[]>([]);
  const [twitchAPI, setTwitchAPI] = useState<TwitchAPI | null>(null);

  return (
    <FollowingContext.Provider
      value={{ liveFollowing, setLiveFollowing, twitchAPI, setTwitchAPI }}
    >
      {children}
    </FollowingContext.Provider>
  );
};

export const useFollowing = () => {
  return useContext(FollowingContext);
};
export const useFollowingActions = () => {};
