import AWS from 'aws-sdk';

const SSM = new AWS.SSM();

export const ssmCredentials = async (credentials: string[]) => {
  const response = await SSM.getParameters({
    WithDecryption: true,
    Names: credentials
  }).promise();

  if(!response || !response.Parameters) throw new Error("No params received");

  credentials.sort();
  const returnCredentials: Record<string, string> = {};

  credentials.forEach((element, i) => {
    returnCredentials[element] = response!.Parameters![i].Value;
  });

  return returnCredentials;
}
