import { DiscordCommandResponse, DiscordEventPayload } from "common";
import { config } from "../util/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { z } from "zod";

const { LAMBDA_BOT_APPLICATION_ID, LAMBDA_BOT_TOKEN } = await config();
const rest = new REST({ version: "10" }).setToken(LAMBDA_BOT_TOKEN);

const rpsEmojiReactions = async(dmChannel: {id: string}, message: {id: string}) => {
  await rest
  .put(
    `/channels/${dmChannel.id}/messages/${message.id}/reactions/✊/@me`
  )
  .then((res) => console.debug("emoji reaction res", res))
  .catch((err) => console.error(err));

  await rest
  .put(
    `/channels/${dmChannel.id}/messages/${message.id}/reactions/✋/@me`
  )
  .then((res) => console.debug("emoji reaction res", res))
  .catch((err) => console.error(err));

  await rest
  .put(
    `/channels/${dmChannel.id}/messages/${message.id}/reactions/✌️/@me`
  )
  .then((res) => console.debug("emoji reaction res", res))
  .catch((err) => console.error(err));
}

export const rps = async (
  event: DiscordEventPayload
): Promise<DiscordCommandResponse> => {
  console.log(JSON.stringify(event));

  const sendMessageResponse = z.object({
    id: z.string(),
    recipients: z.array(z.object({ id: z.string() })),
    'last_message_id': z.string(),
  });

  const rpsInitiatorDmObject = sendMessageResponse.parse(
    await rest
      .post(Routes.userChannels(), {
        body: { recipient_id: event.member.user.id },
      })
      .then((res) => {
        console.debug("initiator rest response", res);
        return res;
      })
      .catch((err) => console.error(err))
  );

  const responseUser = Object.keys(event.data.resolved.users)[0];

  const rpsResponderDmObject = sendMessageResponse.parse(
    await rest
      .post(Routes.userChannels(), {
        body: { recipient_id: responseUser },
      })
      .then((res) => {
        console.debug("responder rest response", res);
        return res;
      })
      .catch((err) => console.error(err))
  );

  const messageSentResponse = z.object({
    id: z.string(),
  });

  const initiatorResponse = messageSentResponse.parse(
    await rest.post(`/channels/${rpsInitiatorDmObject.id}/messages`, {
      body: {
        content: "RPS Initiator",
      },
    })
    .then((res) => {
      console.debug('initiator response', res); 
      return res}
    )
    .catch(err => console.error(err))
  );

  await rpsEmojiReactions(rpsInitiatorDmObject, initiatorResponse);

  const responderResponse = messageSentResponse.parse(
    await rest.post(`/channels/${rpsResponderDmObject.id}/messages`, {
      body: {
        content: "RPS Responder",
      },
    })
    .then(res => res)
    .catch(err => console.error(err))
  )

  await rpsEmojiReactions(rpsResponderDmObject, responderResponse);

  return {
    type: 4,
    data: {
      content: "rps test",
      flags: 1 << 6,
    },
  };
};
