import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Stream } from "@/lib/twitch_api/twitch_api_types.ts";
import { useTwitchIRC } from "@/hooks/useTwitchIRC.ts";
import { TwitchAPI } from "@/lib/twitch_api/twitch_api.ts";

type ChatterCtxType = {
  broadcastHandlers: React.RefObject<BroadcastHandler[]>;
  ws: WebSocket | null;
  viewing: Map<string, Stream>;
  _setViewing: React.Dispatch<React.SetStateAction<Map<string, Stream>>>;
  twitchAPI: TwitchAPI;
  token: string;
  clientID: string;
};
export type BroadcastHandler = (msg: string) => void;

//@ts-ignore
const ChatterCtx = createContext<ChatterCtxType>();

export const ChatterCtxProvider = ({
  children,
  twitchAPI,
  clientID,
  token,
}: {
  children: React.ReactNode;
  twitchAPI: TwitchAPI;
  token: string;
  clientID: string;
}) => {
  const [viewing, _setViewing] = useState<Map<string, Stream>>(new Map());
  const ws = useTwitchIRC(twitchAPI, token);
  const broadcastHandlers = useRef<BroadcastHandler[]>([]);
  return (
    <ChatterCtx.Provider
      value={{
        broadcastHandlers,
        viewing,
        _setViewing,
        ws,
        twitchAPI,
        token,
        clientID,
      }}
    >
      {children}
    </ChatterCtx.Provider>
  );
};

export const useChatterCtx = () => {
  return useContext(ChatterCtx);
};

export const useViewing = () => {
  const { _setViewing, ws, viewing } = useContext(ChatterCtx);

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
        new Map(prevViewing).set(stream.user_login, stream)
      ),
    [_setViewing],
  );
  return { part, addViewing, viewing };
};
