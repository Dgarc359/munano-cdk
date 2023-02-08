import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import nacl from 'tweetnacl';
import {ssmCredentials, retrieveCommand} from '../lib';

const { LAMBDA_BOT_PUBLIC_KEY } = await ssmCredentials(["LAMBDA_BOT_PUBLIC_KEY"]);

const BadRequest = {
  statusCode: 401,
  body: "Bad Request"
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if(!LAMBDA_BOT_PUBLIC_KEY) throw new Error('Error retrieving credentials');

  const {body, headers} = event;
  if(!body) return BadRequest

  const signature = headers['x-signature-ed25519'];
  const timestamp = headers['x-signature-timestamp'];

  if(!signature || !timestamp) return BadRequest;

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(LAMBDA_BOT_PUBLIC_KEY, 'hex')
  );

  console.debug("isVerified:",isVerified);

  if (!isVerified) {
    return BadRequest
  }

  const parsedBody = JSON.parse(body);
  console.debug("parsed Body",parsedBody);
  const {type: kind, data} = JSON.parse(body);
  // const {name} = data;
  // if (!name) throw new Error('No command found');
  // console.debug('kind',kind, 'name', name);

  if (kind === 1) {
    return {
      statusCode: 200,
      body: body,
    }
  } else if (kind === 2) {
    // console.debug('command name',name);
    const {name} = data;
    if(!name) throw new Error('No command found');
    const callback = retrieveCommand(name);
    const response = await callback(parsedBody);
    // console.debug('response', response);
    return response;
  }

  return BadRequest
};