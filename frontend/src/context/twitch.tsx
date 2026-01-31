import { createContext } from "react";

export type TwitchContextType = {
  clientID: string | null;
};

const InitialTwitchState: TwitchContextType = {
  clientID: null,
};

export const TwitchContext =
  createContext<TwitchContextType>(InitialTwitchState);

export const TwitchProvider = ({ children }: { children: React.ReactNode }) => {
  const [twitchState, setTwitchState] = useState(InitialTwitchState);

  return (
    <TwitchContext.Provider value={twitchState}>
      {children}
    </TwitchContext.Provider>
  );
};
