export type DiscordCommand = {
  name: string;
  description: string;
}

type CommandTypes = 4;

export type DiscordCommandResponse = {
  type: CommandTypes;
  data: {
    content: string;
    flags?: number;
  }
}

export type DiscordMember = {
  avatar: any, // can be null
  communication_disabled_until: any, // can be null
  deaf: boolean,
  flags: number,
  is_pending: boolean,
  joined_at: string,
  mute: boolean,
  nick: any, // can be null
  pending: boolean,
  permissions: string,
  premium_since: any, // can be null
  roles: string[],
  user: {
    avatar: string,
    avatar_decoration: any, // can be null
    discriminator: string,
    id: string,
    public_flags: number,
    username: string
  }
}
export type DiscordEventPayload = {
  app_permissions: string,
  application_id: string,
  channel_id: string,
  data: {
    id: string,
    name: string,
    options: [ any[] ],
    resolved: { members: any[], users: any[] },
    type: number
  },
  entitlement_sku_ids: any[],
  guild_id: string,
  guild_locale: string,
  id: string,
  locale: string,
  member: DiscordMember,
  token: string,
  type: number,
  version: number
}
