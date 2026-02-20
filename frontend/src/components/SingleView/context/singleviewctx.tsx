import { Stream } from "@/lib/twitch_api/twitch_api_types";
import { createContext, useContext, useState } from "react";

export type SingleViewCtxType = {
  selected: Stream | null;
  _setSelected: React.Dispatch<React.SetStateAction<Stream | null>>;
  ws: WebSocket | null;
};
//@ts-ignore
const SingleViewCtx = createContext<SingleViewCtxType>();

type Props = {
  children: React.ReactNode;
};
export function SingleViewProvider({ children }: Props) {
  const [selected, _setSelected] = useState<Stream | null>(null);

  return (
    <SingleViewCtx.Provider
      value={{
        selected,
        _setSelected,
        ws: null,
      }}
    >
      {children}
    </SingleViewCtx.Provider>
  );
}

export function useSingleViewCtx() {
  const { _setSelected, selected } = useContext(SingleViewCtx);

  return {
    setSelected: _setSelected,
    selected,
  };
}
