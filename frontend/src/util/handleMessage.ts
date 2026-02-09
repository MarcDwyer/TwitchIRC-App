import { IrcMessage } from "../types/twitch_data.ts";
import { msgParcer } from "./msgParcer.ts";

export type PrivMsgEvt = {
  message: string;
  username: string;
  channel: string;
  color?: string;
};

export type HandleMsgCallbacks = {
  PRIVMSG?: (msg: IrcMessage | null) => void;
  JOIN?: (channelName: string) => void;
  PART?: () => void;
  "001"?: () => void;
  PING?: () => void;
};

export function getCommand(line: string): keyof HandleMsgCallbacks {
  if (line.startsWith("PING")) return "PING";
  // With tags: @tags :user COMMAND ...  — command is at index 2
  // Without tags: :user COMMAND ...     — command is at index 1
  const parts = line.split(" ");
  if (parts[0].startsWith("@")) return parts[2] as keyof HandleMsgCallbacks;
  return parts[1] as keyof HandleMsgCallbacks;
}

export function handleMessage(
  data: string,
  cbs: HandleMsgCallbacks = {},
): void {
  const lines = data.split("\r\n").filter(Boolean);

  for (const line of lines) {
    const command = getCommand(line);
    if (!cbs[command]) {
      continue;
    }
    switch (command) {
      case "PRIVMSG": {
        const ircMsg = msgParcer(data);
        cbs[command](ircMsg);
        // const match = line.match(
        //   /(?:@(\S+) )?:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG (#\w+) :(.+)/,
        // );
        // if (match) {
        //   const [, tagStr, username, channel, message] = match;
        //   const tags = tagStr ? parseTags(tagStr) : {};
        //   const msg: PrivMsgEvt = {
        //     username: tags["display-name"] || username,
        //     message,
        //     channel,
        //     color: tags["color"] || undefined,
        //   };
        //   cbs.PRIVMSG?.(msg);
        // }
        break;
      }
      case "JOIN":
        {
          const match = line.match(
            /(?:@\S+ )?:(\w+)!\w+@\w+\.tmi\.twitch\.tv JOIN (#\w+)/,
          );
          if (match) {
            const [, , channelName] = match;

            cbs[command](channelName);
          }
        }
        break;
      default: {
        cbs[command]();
      }
    }
  }
}
