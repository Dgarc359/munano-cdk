import * as commands from '../src';
import * as externalCommands from '../../external/src';

export const retrieveCommand = (command: string): any => {
//   [commands, externalCommands].forEach((commandsArr) => commandsArr.map());

  const callback: any[] = Object.keys(externalCommands).map((e: any) => {
    console.debug(e);
    // @ts-ignore
    if (e === command) return externalCommands[e];
  }).filter((e) => e !== undefined);

  if (callback.length !== 0)return callback[0];

  else {
    const internalCallback = Object.keys(commands).map((e: any) => {
      console.debug(e);
      // @ts-ignore
      if (e === command) return commands[e];
    }).filter(e => e !== undefined);

    if (internalCallback.length !== 0) return internalCallback[0];
  }

  throw new Error('failed to find requested command')
}
