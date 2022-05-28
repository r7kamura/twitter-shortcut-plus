import { useEffect, useState } from "react";
import { commands, type Command } from "../command";
import { Keybinding } from "../keybinding";
import { detectKeyString } from "../keyboard";

const commandByName = commands.reduce((result, command) => {
  result[command.name] = command;
  return result;
}, {} as { [key: string]: Command });

const keybindingsStorageKey = "keybindings";

export default function App() {
  const [keybindings, setKeybindings] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get(keybindingsStorageKey, ({ keybindings }) => {
      if (keybindings) {
        setKeybindings(keybindings);
      }
    });
  }, []);

  function onCommandKeydown({
    command,
    event,
  }: {
    command: Command;
    event: KeyboardEvent;
  }) {
    const keyString = detectKeyString(event);
    if (keyString == null || keyString == "tab" || keyString == "shift+tab") {
      return;
    }
    const newKeybindings = mergeKeybindings(keybindings, {
      command: command.name,
      key: keyString,
    });
    chrome.storage.sync.set({ [keybindingsStorageKey]: newKeybindings });
    setKeybindings(newKeybindings as any);
    event.preventDefault();
  }

  function onResetButtonClick() {
    resetKeybindings();
  }

  function resetKeybindings() {
    chrome.storage.sync.remove(keybindingsStorageKey);
    setKeybindings([]);
  }

  return (
    <div className="text-base pb-16">
      <header className="max-w-xl mx-auto p-4 py-8 text-lg">
        <h1 className="font-bold">Twitter Shortcut Plus</h1>
      </header>
      <main>
        <CommandsSection
          commandNames={[
            "browseLinks",
            "browseLinksInBackground",
            "browseMedia",
            "browseMediaInBackground",
          ]}
          category="Browse"
          keybindings={keybindings}
          onCommandKeydown={onCommandKeydown}
        />
        <CommandsSection
          commandNames={["selectAuthor"]}
          category="Select"
          keybindings={keybindings}
          onCommandKeydown={onCommandKeydown}
        />
        <CommandsSection
          commandNames={["downloadMedia", "togglePinTweet"]}
          category="Others"
          keybindings={keybindings}
          onCommandKeydown={onCommandKeydown}
        />
        <section className="max-w-xl mx-auto p-4 rounded-xl shadow-lg bg-white mt-8">
          <div className="flex flex-row items-center py-2">
            <div className="basis-2/3">
              Shortcuts are automatically saved.
              <br />
              Restore all shortcuts to their defaults?
            </div>
            <div className="basis-1/3 text-center">
              <button
                type="button"
                className="rounded text-white bg-red-600 hover:bg-red-700 py-1 px-4"
                onClick={onResetButtonClick}
              >
                Reset all
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function CommandsSection({
  commandNames,
  category,
  keybindings,
  onCommandKeydown,
}: {
  commandNames: string[];
  category: string;
  keybindings: Keybinding[];
  onCommandKeydown: Function;
}) {
  return (
    <section className="max-w-xl mx-auto p-4 rounded-xl shadow-lg bg-white mb-8">
      <div className="divide-y">
        <h2 className="font-bold pb-4">{category}</h2>
        {commandNames.map((commandName) => {
          const command = commandByName[commandName];
          return (
            <CommandForm
              command={command}
              keybindings={keybindings}
              onCommandKeydown={onCommandKeydown}
            />
          );
        })}
      </div>
    </section>
  );
}

function CommandForm({
  command,
  keybindings,
  onCommandKeydown,
}: {
  command: Command;
  keybindings: Keybinding[];
  onCommandKeydown: Function;
}) {
  const key =
    keybindings.find((keybinding) => {
      return keybinding.command == command.name;
    })?.key || command.default;

  return (
    <div className="flex flex-row items-center py-2">
      <div className="basis-1/2">{command.description}</div>
      <div className="basis-1/2">
        <input
          type="text"
          autoComplete="off"
          readOnly
          value={key}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          onKeyDown={(event) => {
            onCommandKeydown({ command, event });
          }}
        />
      </div>
    </div>
  );
}

function mergeKeybindings(
  keybindings: Keybinding[],
  newKeybinding: Keybinding
) {
  return [
    ...keybindings.filter((keybinding) => {
      return keybinding.command != newKeybinding.command;
    }),
    newKeybinding,
  ].filter((keybinding) => {
    const command = commandByName[keybinding.command]!;
    return command.default != keybinding.key;
  });
}
