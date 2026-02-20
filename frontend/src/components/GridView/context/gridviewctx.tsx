import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchCtx } from "@/context/twitchctx";

type GridViewCtxType = {
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
  viewing: Map<string, Stream>;
  _setViewing: React.Dispatch<React.SetStateAction<Map<string, Stream>>>;
};
export type BroadcastHandler = (msg: string) => void;

//@ts-ignore
const GridViewCtx = createContext<GridViewCtxType>();

export const GridViewCtxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewing, _setViewing] = useState<Map<string, Stream>>(new Map());

  const broadcastHandlers = useRef<BroadcastHandler[]>([]);
  return (
    <GridViewCtx.Provider
      value={{
        broadcastHandlers,
        viewing,
        _setViewing,
      }}
    >
      {children}
    </GridViewCtx.Provider>
  );
};

export const useGridViewCtx = () => {
  const { _setViewing, viewing } = useContext(GridViewCtx);
  const {
    irc: { ws },
  } = useTwitchCtx();

  const part = useCallback(
    (stream: Stream, channel: string) => {
      console.log(`parting ${channel}`);
      _setViewing((prevViewing) => {
        const updated = new Map(prevViewing);
        updated.delete(stream.user_login);
        return updated;
      });
      ws?.send(`PART ${channel}`);
    },
    [ws, _setViewing],
  );

  const addViewing = useCallback(
    (stream: Stream) =>
      _setViewing((prevViewing) =>
        new Map(prevViewing).set(stream.user_login, stream),
      ),
    [_setViewing],
  );
  const clearViewing = () => _setViewing(new Map());
  return { part, addViewing, viewing, clearViewing };
};
