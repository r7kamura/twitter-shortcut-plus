import {
  browseLinksInForeground,
  browseLinksInBackground,
  browseMediaInForeground,
  browseMediaInBackground,
  deleteTweet,
  downloadMedia,
  quote,
  selectAuthor,
  selectQuotedTweet,
  togglePinTweet,
} from "./twitter";

const commandFunctionByName = {
  browseLinksInForeground,
  browseLinksInBackground,
  browseMediaInForeground,
  browseMediaInBackground,
  deleteTweet,
  downloadMedia,
  quote,
  selectAuthor,
  selectQuotedTweet,
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
