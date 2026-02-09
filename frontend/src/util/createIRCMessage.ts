import { Commands, IrcMessage } from "../types/twitch_data.ts";
import { createBadgeObj } from "./parcer_util.ts";

export function createIRCMessage(
  message: string,
  channel: string,
  username: string,
  ircMsg: Partial<IrcMessage> = {},
): IrcMessage {
  return {
    raw: "",
    badges: createBadgeObj(),
    tags: {} as IrcMessage["tags"],
    prefix: "",
    command: Commands.PRIVMSG,
    params: [],
    channel,
    message,
    username,
    ...ircMsg,
  };
}
