import { commands } from "./command";

export type Keybinding = {
  command: string;
  key: string;
};

type KeyMap = {
  [key: string]: string[];
};

const defaultKeybindings = commands.map((command) => {
  return {
    command: command.name,
    key: command.default,
  };
});

export function generateKeyMap(keybindings: Keybinding[]): KeyMap {
  return mergeWithDefaultKeybindings(keybindings).reduce((result, element) => {
    if (typeof result[element.key] == "undefined") {
      result[element.key] = [];
    }
    result[element.key] = [...result[element.key], element.command];
    return result;
  }, {} as KeyMap);
}

function mergeWithDefaultKeybindings(keybindings: Keybinding[]): Keybinding[] {
  return Object.values({
    ...indexBy(defaultKeybindings, "command"),
    ...indexBy(keybindings, "command"),
  });
}

function indexBy(array: any[], key: string) {
  return array.reduce((result, element) => {
    result[element[key]] = element;
    return result;
  }, {});
}
