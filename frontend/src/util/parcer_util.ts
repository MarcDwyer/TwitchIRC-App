import { Badges } from "../types/twitch_data.ts";

export function getChannelName(channel: string) {
  channel = channel.toLowerCase();
  if (channel[0] !== "#") channel = "#" + channel;
  return channel;
}

export function removeBreaks(s: string) {
  return s.replace(/(\r\n|\n|\r)/gm, "");
}

export function findChannelName(str: string) {
  let chan = "";
  for (const char of str) {
    if (char === ":") break;
    chan += char;
  }
  return chan;
}

export const createBadgeObj = (): Badges => ({
  subscriber: false,
  glitchcon: false,
  turbo: false,
  moderator: false,
});
export function setBadges(badges: string, badgeRec: Badges) {
  const reg = /^[a-z]+$/i;
  let badge = "";

  for (const char of badges) {
    const test = reg.test(char);
    if (test) {
      badge += char;
    } else {
      if (badge.length) {
        (badgeRec as Record<string, boolean>)[badge] = true;
      }
      badge = "";
    }
  }
}
