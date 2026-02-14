import type {
  LiveFollowedStreamsResponse,
  Stream,
  UserInfo,
} from "./twitch_api_types.ts";
const baseUrl = "https://api.twitch.tv/helix";

export async function createTwitchAPI(
  clientId: string,
  oauthToken: string,
): Promise<TwitchAPI> {
  const response = await fetch(`${baseUrl}/users`, {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${oauthToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch user info: ${response.status} ${JSON.stringify(error)}`,
    );
  }

  const data = await response.json();
  const userInfo: UserInfo = data.data[0];
  return new TwitchAPI(clientId, oauthToken, userInfo);
}

export class TwitchAPI {
  private clientId: string;
  private oauthToken: string;
  userInfo: UserInfo;

  constructor(clientId: string, oauthToken: string, userInfo: UserInfo) {
    this.clientId = clientId;
    this.oauthToken = oauthToken;
    this.userInfo = userInfo;
  }

  async getUserID(clientId: string, oauthToken: string) {
    const response = await fetch(`${baseUrl}/users`, {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${oauthToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch user info: ${response.status} ${
          JSON.stringify(error)
        }`,
      );
    }

    const data = await response.json();
    const userInfo: UserInfo = data.data[0];
    return userInfo;
  }
  async getLiveFollowedChannels(
    first: number = 100,
    after?: string,
  ): Promise<LiveFollowedStreamsResponse> {
    const params = new URLSearchParams({
      user_id: this.userInfo.id,
      first: first.toString(),
    });

    if (after) {
      params.append("after", after);
    }

    const response = await fetch(
      `${baseUrl}/streams/followed?${params.toString()}`,
      {
        headers: {
          "Client-ID": this.clientId,
          Authorization: `Bearer ${this.oauthToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch live followed streams: ${response.status} ${
          JSON.stringify(error)
        }`,
      );
    }
    return (await response.json()) as LiveFollowedStreamsResponse;
  }

  async getUserByLogin(login: string | string[]): Promise<UserInfo[]> {
    const logins = Array.isArray(login) ? login : [login];
    const params = new URLSearchParams();
    for (const l of logins) {
      params.append("login", l);
    }

    const response = await fetch(
      `${baseUrl}/users?${params.toString()}`,
      {
        headers: {
          "Client-ID": this.clientId,
          Authorization: `Bearer ${this.oauthToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch user: ${response.status} ${JSON.stringify(error)}`,
      );
    }

    const data = await response.json();
    return data.data as UserInfo[];
  }

  async getStreamByLogin(login: string | string[]): Promise<Stream[]> {
    const logins = Array.isArray(login) ? login : [login];
    const params = new URLSearchParams();
    for (const l of logins) {
      params.append("user_login", l);
    }

    const response = await fetch(
      `${baseUrl}/streams?${params.toString()}`,
      {
        headers: {
          "Client-ID": this.clientId,
          Authorization: `Bearer ${this.oauthToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch stream: ${response.status} ${JSON.stringify(error)}`,
      );
    }

    const data = await response.json();
    return data.data as Stream[];
  }
}
