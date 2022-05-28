export type Command = {
  default: string;
  description: string;
  name: string;
};

const commands: Array<Command> = [
  {
    default: "alt+w",
    description: "Browse links in foreground",
    name: "browseLinksInForeground",
  },
  {
    default: "w",
    description: "Browse links in background",
    name: "browseLinksInBackground",
  },
  {
    default: "alt+f",
    description: "Browse media in foreground",
    name: "browseMediaInForeground",
  },
  {
    default: "f",
    description: "Browse media in background",
    name: "browseMediaInBackground",
  },
  {
    default: "alt+delete",
    description: "Delete tweet",
    name: "deleteTweet",
  },
  {
    default: "v",
    description: "Download media",
    name: "downloadMedia",
  },
  {
    default: "q",
    description: "Quote tweet",
    name: "quote",
  },
  {
    default: "z",
    description: "Toggle pin tweet",
    name: "togglePinTweet",
  },
  {
    default: "a",
    description: "Select author",
    name: "selectAuthor",
  },
  {
    default: "alt+q",
    description: "Select quoted tweet",
    name: "selectQuotedTweet",
  },
];

export { commands };
