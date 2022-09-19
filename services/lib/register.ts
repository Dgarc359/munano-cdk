
import * as command from './command';
import * as externalCommands from '../external/command'
import axios from 'axios';
import {config} from './config';

const { LAMBDA_BOT_APPLICATION_ID, LAMBDA_BOT_TOKEN } = await config();

const url = `https://discord.com/api/v10/applications/${LAMBDA_BOT_APPLICATION_ID}/commands`;

const headers = {
  Authorization: `Bot ${LAMBDA_BOT_TOKEN}`,
  'Content-Type': 'application/json',
};

console.log(command, externalCommands);

const sendRequest = (commands: any) => {
  Object.keys(commands).map((e) => {
    axios
      //@ts-ignore
      .post(url, JSON.stringify(commands[e]), {
        headers: headers,
      })
      .then((e) => {
        console.log(e.status, e.data);
      })
      .catch(err => { throw new Error(err)});
  });
}

sendRequest(command);
sendRequest(externalCommands);
