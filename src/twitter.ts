import { openUrlInBackground, openUrlInForeground } from "./tab";

export function browseLinks() {
  findLinkUrls()
    .reverse()
    .forEach((url) => {
      openUrlInForeground(url);
    });
}

export function browseLinksInBackground() {
  findLinkUrls().forEach((url) => {
    openUrlInBackground(url);
  });
}

export function browseMedia() {
  findMediaUrls()
    .reverse()
    .forEach((url) => {
      openUrlInForeground(url);
    });
}

export function browseMediaInBackground() {
  findMediaUrls().forEach((url) => {
    openUrlInBackground(url);
  });
}

export function downloadMedia() {
  const urls = findMediaUrls();
  if (urls.length > 0) {
    download(urls);
  }
}

export function selectAuthor() {
  findAuthorLink()?.click();
}

export function togglePinTweet() {
  const menuButtonElement = findMenuButtonElement();
  if (!menuButtonElement) {
    return;
  }

  menuButtonElement.click();
  const pinMenuItemElement = findPinMenuItemElement();
  if (pinMenuItemElement) {
    pinMenuItemElement.click();
    findActiveElement()?.click();
  } else {
    menuButtonElement.click();
  }
}

// https://pbs.twimg.com/media/x.jpg?format=jpg&name=360x360 to
// https://pbs.twimg.com/media/x.jpg?name=orig
//
// https://pbs.twimg.com/media/x?format=jpg&name=small to
// https://pbs.twimg.com/media/x.jpg?name=orig
//
// https://pbs.twimg.com/media/x.png?format=jpg&name=240x240 to
// https://pbs.twimg.com/media/x.png?name=orig to
//
// https://pbs.twimg.com/media/x?format=png&name=small to
// https://pbs.twimg.com/media/x.png?name=orig to
function convertRawImageUrlToOriginalImageUrl(url: string) {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);
  if (
    urlObject.pathname.split(".", 2).length == 1 &&
    searchParams.get("format")
  ) {
    urlObject.pathname += `.${searchParams.get("format")}`;
  }
  searchParams.delete("format");
  searchParams.set("name", "orig");
  urlObject.search = searchParams.toString();
  return urlObject.toString();
}

function download(urls: Array<string>) {
  chrome.runtime.sendMessage({ type: "download", payload: { urls } });
}

function findAuthorLink() {
  return document.activeElement?.querySelector(
    'a[role="link"][tabindex="-1"]'
  ) as HTMLElement | null;
}

function findActiveElement() {
  return document.activeElement as HTMLElement | null;
}

function findImageUrlsFromListView() {
  return Array.from(
    document.activeElement?.querySelectorAll('img[alt]:not([alt=""])') || []
  ).reduce((urls: string[], imageElement) => {
    const source = imageElement.getAttribute("src")!;
    urls = [...urls, source];
    return urls;
  }, []);
}

// TODO
function findImageUrlsFromDetailView() {
  return [];
}

function findLinkUrls() {
  const urls = Array.from(
    document.activeElement?.querySelectorAll(
      'a[role="link"][target="_blank"]'
    ) || []
  ).reduce((result, element) => {
    const url = element.getAttribute("href");
    if (url) {
      result = [...result, url];
    }
    return result;
  }, [] as string[]);
  return unique(urls);
}

function findMediaUrls() {
  return [...findImageUrlsFromDetailView(), ...findImageUrlsFromListView()].map(
    convertRawImageUrlToOriginalImageUrl
  );
}

function findMenuButtonElement() {
  return document.activeElement?.querySelector(
    'div[aria-haspopup="menu"]'
  ) as HTMLElement | null;
}

function findPinIconElement() {
  return document.querySelector(
    'div[role="menu"] path[d="M20.472 14.738c-.388-1.808-2.24-3.517-3.908-4.246l-.474-4.307 1.344-2.016c.258-.387.28-.88.062-1.286-.218-.406-.64-.66-1.102-.66H7.54c-.46 0-.884.254-1.1.66-.22.407-.197.9.06 1.284l1.35 2.025-.42 4.3c-1.667.732-3.515 2.44-3.896 4.222-.066.267-.043.672.222 1.01.14.178.46.474 1.06.474h3.858l2.638 6.1c.12.273.39.45.688.45s.57-.177.688-.45l2.638-6.1h3.86c.6 0 .92-.297 1.058-.474.265-.34.288-.745.228-.988zM12 20.11l-1.692-3.912h3.384L12 20.11zm-6.896-5.413c.456-1.166 1.904-2.506 3.265-2.96l.46-.153.566-5.777-1.39-2.082h7.922l-1.39 2.08.637 5.78.456.153c1.355.45 2.796 1.78 3.264 2.96H5.104z"]'
  );
}

function findPinMenuItemElement() {
  return findPinIconElement()?.closest(
    'div[role="menuitem"]'
  ) as HTMLElement | null;
}

function unique(array: string[]) {
  return Array.from(new Set(array));
}
