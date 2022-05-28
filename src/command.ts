export type Command = {
  default: string;
  description: string;
  name: string;
};

const commands: Array<Command> = [
  {
    default: "alt+l",
    description: "Browse links",
    name: "browseLinks",
  },
  {
    default: "u",
    description: "Browse links in background",
    name: "browseLinksInBackground",
  },
  {
    default: "alt+s",
    description: "Browse media",
    name: "browseMedia",
  },
  {
    default: "i",
    description: "Browse media in background",
    name: "browseMediaInBackground",
  },
  {
    default: "w",
    description: "Download media",
    name: "downloadMedia",
  },
];

export { commands };
