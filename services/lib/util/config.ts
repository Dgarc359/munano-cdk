import {ssmCredentials} from './ssm'

type Config = {
  LAMBDA_BOT_APPLICATION_ID: string,
  LAMBDA_BOT_TOKEN: string;
}

export const config = async (): Promise<Config> => {
  const {LAMBDA_BOT_APPLICATION_ID, LAMBDA_BOT_TOKEN} = 
    await ssmCredentials(['LAMBDA_BOT_APPLICATION_ID', 'LAMBDA_BOT_TOKEN']);

  if (!LAMBDA_BOT_APPLICATION_ID || !LAMBDA_BOT_TOKEN) throw new Error('Error retrieving creds')

  return {
    LAMBDA_BOT_APPLICATION_ID: LAMBDA_BOT_APPLICATION_ID,
    LAMBDA_BOT_TOKEN: LAMBDA_BOT_TOKEN,
  }
}
