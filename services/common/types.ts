export type DiscordCommand = {
  name: string;
  description: string;
}

export type DiscordCommandResponse = {
  type: number;
  data: {
    content: string;
  }
}
