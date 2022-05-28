import { detectKeyString } from "./keyboard";
import { runCommands } from "./commander";
import { generateKeyMap } from "./keybinding";

chrome.runtime.sendMessage(
  { type: "requestKeybindings" },
  ({ keybindings }) => {
    const keyMap = generateKeyMap(keybindings);
    document.addEventListener("keydown", (event) => {
      if (document.activeElement?.getAttribute("contenteditable") == "true") {
        return;
      }

      const key = detectKeyString(event)!;
      const commandNames = keyMap[key] || [];
      runCommands(commandNames);

      if (commandNames.length >= 1) {
        event.preventDefault();
      }
    });
  }
);
