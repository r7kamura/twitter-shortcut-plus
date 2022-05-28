import {
  browseLinks,
  browseLinksInBackground,
  browseMedia,
  browseMediaInBackground,
  downloadMedia,
} from "./twitter";

const commandFunctionByName = {
  browseLinks,
  browseLinksInBackground,
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
