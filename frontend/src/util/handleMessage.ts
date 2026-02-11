import { Commands, IrcMessage } from "../types/twitch_data.ts";
import { msgParcer } from "./msgParcer.ts";

export type PrivMsgEvt = {
  message: string;
  username: string;
  channel: string;
  color?: string;
};

export type HandleMsgCallbacks = {
  [K in keyof typeof Commands]?: (msg: IrcMessage) => void;
};
export type HandleMessageParams = {
  data: string;
  cbs: HandleMsgCallbacks;
  shouldInvoke?: (ircMsg: IrcMessage) => boolean;
};
export function handleMessage({
  data,
  cbs,
  shouldInvoke,
}: HandleMessageParams): void {
  const ircMsg = msgParcer(data);
  if (!ircMsg || (ircMsg && shouldInvoke && !shouldInvoke(ircMsg))) return;
  cbs[ircMsg.command]?.(ircMsg);
}

export type HandleChannelEvtParams = {
  data: string;
  cbs: HandleMsgCallbacks;
  channel: string;
};
export function handleChannelMsg({
  data,
  cbs,
  channel,
}: HandleChannelEvtParams) {
  const ircMsg = msgParcer(data);
  if (!ircMsg || (ircMsg && ircMsg.channel !== channel)) return;
  cbs[ircMsg.command]?.(ircMsg);
}
