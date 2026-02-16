import {
  createContext,
  ReactNode,
  useContext,
} from "react";
import { usePinned } from "@Chatter/hooks/usePinned.ts";
import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";

type PinnedContextType = {
  pinned: Map<string, UserInfo>;
  addPinned: (user: UserInfo) => void;
  removePinned: (login: string) => void;
  checkPinnedLive: (login: string) => Stream | undefined;
};

//@ts-ignore
const PinnedContext = createContext<PinnedContextType>();

export const PinnedProvider = ({ children }: { children: ReactNode }) => {
  const { pinned, addPinned, removePinned, checkPinnedLive } = usePinned();

  return (
    <PinnedContext.Provider
      value={{
        pinned,
        addPinned,
        removePinned,
        checkPinnedLive,
      }}
    >
      {children}
    </PinnedContext.Provider>
  );
};

export const usePinnedCtx = () => {
  return useContext(PinnedContext);
};
