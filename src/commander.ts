import { browseMedia, browseMediaInBackground, downloadMedia } from "./twitter";

const commandFunctionByName = {
  browseMedia,
  browseMediaInBackground,
  downloadMedia,
} as { [key: string]: Function };

export function runCommands(commandNames: string[]) {
  commandNames.forEach((commandName) => {
    const commandFunction = commandFunctionByName[commandName];
    if (commandFunction) {
      commandFunction();
    }
  });
}
