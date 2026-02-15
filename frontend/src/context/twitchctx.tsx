import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

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
};
const InitialOAuth = {
  token: null,
  validated: false,
  error: null,
};
const InitialTwitchState: TwitchContextType = {
  clientID: null,
  oauth: InitialOAuth,
  _setClientID: () => {},
  _setOAuth: () => {},
};

export const TwitchContext = createContext<TwitchContextType>(
  InitialTwitchState,
);

export const TwitchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [clientID, _setClientID] = useState<string | null>(null);
  const [oauth, _setOAuth] = useState<OAuth>(InitialOAuth);

  return (
    <TwitchContext.Provider
      value={{
        clientID,
        _setClientID,
        oauth,
        _setOAuth,
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
