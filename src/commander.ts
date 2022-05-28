import {
  browseLinks,
  browseLinksInBackground,
  browseMedia,
  browseMediaInBackground,
  deleteTweet,
  downloadMedia,
  selectAuthor,
  togglePinTweet,
} from "./twitter";

const commandFunctionByName = {
  browseLinks,
  browseLinksInBackground,
  browseMedia,
  browseMediaInBackground,
  deleteTweet,
  downloadMedia,
  selectAuthor,
  togglePinTweet,
} as { [key: string]: Function };

export function runCommands(commandNames: string[]) {
  commandNames.forEach((commandName) => {
    const commandFunction = commandFunctionByName[commandName];
    if (commandFunction) {
      commandFunction();
    }
  });
}
