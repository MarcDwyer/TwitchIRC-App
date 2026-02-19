import { Stream } from "@/lib/twitch_api/twitch_api_types";
import { createContext, useContext, useState } from "react";

export type WatchCtxType = {
  selected: Stream | null;
  _setSelected: React.Dispatch<React.SetStateAction<Stream | null>>;
  ws: WebSocket | null;
};
//@ts-ignore
const WatchCtx = createContext<WatchCtxType>();

type Props = {
  children: React.ReactNode;
};
export function WatchProvider({ children }: Props) {
  const [selected, _setSelected] = useState<Stream | null>(null);

  return (
    <WatchCtx.Provider
      value={{
        selected,
        _setSelected,
        ws: null,
      }}
    >
      {children}
    </WatchCtx.Provider>
  );
}

export function useWatchCtx() {
  const { _setSelected, selected } = useContext(WatchCtx);

  return {
    setSelected: _setSelected,
    selected,
  };
}
