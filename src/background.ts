chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  switch (request.type) {
    case "download":
      request.payload.urls.forEach((url: string) => {
        chrome.downloads.download({ url });
      });
      break;
    case "requestKeybindings":
      chrome.storage.sync.get("keybindings", ({ keybindings }) => {
        sendResponse({
          keybindings: keybindings || [],
        });
      });
      return true;
  }
  return;
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
