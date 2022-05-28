import { browseMedia, browseMediaInBackground } from "./twitter";

const commandFunctionByName = {
  browseMedia,
  browseMediaInBackground,
} as { [key: string]: Function };

export function runCommands(commandNames: string[]) {
  commandNames.forEach((commandName) => {
    const commandFunction = commandFunctionByName[commandName];
    if (commandFunction) {
      commandFunction();
    }
  });
}
