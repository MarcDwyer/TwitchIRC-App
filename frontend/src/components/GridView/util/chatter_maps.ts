import { Stream, UserInfo } from "@/lib/twitch_api/twitch_api_types.ts";

export const createMapFromUsers = (users: UserInfo[]) =>
  users.reduce<Map<string, UserInfo>>(
    (map, user) => map.set(user.login, user),
    new Map(),
  );

export const createMapFromStream = (streams: Stream[]) =>
  streams.reduce<Map<string, Stream>>(
    (map, stream) => map.set(stream.user_login, stream),
    new Map(),
  );
