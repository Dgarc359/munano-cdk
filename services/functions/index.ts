import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import nacl from 'tweetnacl';
import {ssmCredentials} from '../lib';

const { LAMBDA_BOT_PUBLIC_KEY } = await ssmCredentials(["LAMBDA_BOT_PUBLIC_KEY"])

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const {body, headers} = event;

  const signature = headers['x-signature-ed25519']
  const timestamp = headers['x-signature-timestamp'];

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(LAMBDA_BOT_PUBLIC_KEY, 'hex')
  );

  console.log(isVerified);
  if (!isVerified) {
    return {
      statusCode: 401,
      body: "Bad Request"
    }
  }
  const parsedBody = JSON.parse(body);
  console.log(parsedBody);
  const {type: kind} = JSON.parse(body);
  console.log(kind);
  console.log(kind === 1);
  if (kind === 1) {
    return {
      statusCode: 200,
      body: body,
    }
  }

  return {
    statusCode: 401,
    body: "invalid request signature"
  }
};