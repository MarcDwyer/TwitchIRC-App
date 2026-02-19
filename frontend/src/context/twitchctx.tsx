import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { TwitchAPI } from "../lib/twitch_api/twitch_api.ts";
import { useConnectIRC } from "@/hooks/useConnectIRC.ts";

export type OAuth = {
  token: string | null;
  validated: boolean;
  error: string | null;
};

export type TwitchContextType = {
  oauth: OAuth;
  _setOAuth: Dispatch<SetStateAction<OAuth>>;
  clientID: string | null;
  _setClientID: Dispatch<SetStateAction<string | null>>;
  twitchAPI: null | TwitchAPI;
  setTwitchAPI: Dispatch<SetStateAction<TwitchAPI | null>>;
  irc: ReturnType<typeof useConnectIRC>;
};
const InitialOAuth = {
  token: null,
  validated: false,
  error: null,
};
//@ts-ignore
export const TwitchContext = createContext<TwitchContextType>();

export const TwitchProvider = ({ children }: { children: ReactNode }) => {
  const [clientID, _setClientID] = useState<string | null>(null);
  const [oauth, _setOAuth] = useState<OAuth>(InitialOAuth);
  const [twitchAPI, setTwitchAPI] = useState<TwitchAPI | null>(null);
  const irc = useConnectIRC();

  return (
    <TwitchContext.Provider
      value={{
        clientID,
        _setClientID,
        oauth,
        _setOAuth,
        twitchAPI,
        setTwitchAPI,
        irc,
      }}
    >
      {children}
    </TwitchContext.Provider>
  );
};

export const useTwitchCtx = () => {
  const twitch = useContext(TwitchContext);
  return twitch;
};
