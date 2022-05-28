export type Command = {
  default: string;
  description: string;
  name: string;
};

const commands: Array<Command> = [
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
];

export { commands };
