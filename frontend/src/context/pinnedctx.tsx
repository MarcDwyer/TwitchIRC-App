import { createContext, ReactNode, useContext } from "react";
import { usePinned } from "@/hooks/usePinned.ts";

type PinnedContextType = ReturnType<typeof usePinned>;

//@ts-ignore
const PinnedContext = createContext<PinnedContextType>();

export const PinnedProvider = ({ children }: { children: ReactNode }) => {
  const {
    pinned,
    addPinnedFromUser,
    addPinnedFromStream,
    removePinned,
  } = usePinned();

  return (
    <PinnedContext.Provider
      value={{
        pinned,
        addPinnedFromUser,
        addPinnedFromStream,
        removePinned,
      }}
    >
      {children}
    </PinnedContext.Provider>
  );
};

export const usePinnedCtx = () => {
  return useContext(PinnedContext);
};
