import { compact, unique } from "./array";
import { openUrlInBackground, openUrlInForeground } from "./tab";

export function browseLinksInForeground() {
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

export function browseMediaInForeground() {
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

export function deleteTweet() {
  const menuButtonElement = findMenuButtonElement();
  if (!menuButtonElement) {
    return;
  }

  menuButtonElement.click();
  const deleteMenuItemElement = findDeleteMenuItemElement();
  if (deleteMenuItemElement) {
    deleteMenuItemElement.click();
    findActiveElement()?.click();
  } else {
    menuButtonElement.click();
  }
}

export function downloadMedia() {
  const urls = findMediaUrls();
  if (urls.length > 0) {
    download(urls);
  }
}

export function quote() {
  findRetweetButtonElement()?.click();
  findQuoteMenuItemElement()?.click();
}

export function selectAuthor() {
  findAuthorLink()?.click();
}

export function selectQuotedTweet() {
  console.log(findQuotedTweet());
  findQuotedTweet()?.click();
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

function findActiveArticle() {
  if (document.activeElement?.tagName == "ARTICLE") {
    return document.activeElement;
  }

  const optionalArticleElement = document.activeElement?.closest("article");
  if (optionalArticleElement) {
    return optionalArticleElement;
  }

  return document.querySelector("article");
}

function findAuthorLink() {
  return findActiveArticle()?.querySelector(
    'a[role="link"][tabindex="-1"]'
  ) as HTMLElement | null;
}

function findActiveElement() {
  return document.activeElement as HTMLElement | null;
}

function findDeleteIconElement() {
  return document.querySelector(
    'div[role="menu"] path[d="M20.746 5.236h-3.75V4.25c0-1.24-1.01-2.25-2.25-2.25h-5.5c-1.24 0-2.25 1.01-2.25 2.25v.986h-3.75c-.414 0-.75.336-.75.75s.336.75.75.75h.368l1.583 13.262c.216 1.193 1.31 2.027 2.658 2.027h8.282c1.35 0 2.442-.834 2.664-2.072l1.577-13.217h.368c.414 0 .75-.336.75-.75s-.335-.75-.75-.75zM8.496 4.25c0-.413.337-.75.75-.75h5.5c.413 0 .75.337.75.75v.986h-7V4.25zm8.822 15.48c-.1.55-.664.795-1.18.795H7.854c-.517 0-1.083-.246-1.175-.75L5.126 6.735h13.74L17.32 19.732z"]'
  );
}

function findDeleteMenuItemElement() {
  return findDeleteIconElement()?.closest(
    'div[role="menuitem"]'
  ) as HTMLElement | null;
}

function findImageUrlsFromOptionalArticleElement(
  optionalArticleElement: Element | undefined | null
) {
  const urls = Array.from(
    optionalArticleElement?.querySelectorAll(
      'img[alt]:not([alt=""])[draggable="true"]'
    ) || []
  ).map((element) => {
    return element.getAttribute("src");
  });
  return compact(urls);
}

function findLinkUrls() {
  return unique([...findLinkUrlsFromCard(), ...findLinkUrlsFromTweetText()]);
}

function findLinkUrlsFromCard() {
  const urls = Array.from(
    findActiveArticle()?.querySelectorAll(
      'div[data-testid="card.wrapper"] a[role="link"][target="_blank"]'
    ) || []
  ).map((element) => {
    return element.getAttribute("href");
  });
  return compact(urls);
}

function findLinkUrlsFromTweetText() {
  const urls = Array.from(
    findActiveArticle()?.querySelectorAll(
      'div[data-testid="tweetText"] a[role="link"][target="_blank"]'
    ) || []
  ).map((element) => {
    return element.getAttribute("href");
  });
  return compact(urls);
}

function findImageUrls() {
  const imageUrls = findImageUrlsFromOptionalArticleElement(
    findActiveArticle()
  );
  return imageUrls.map(convertRawImageUrlToOriginalImageUrl);
}

function findMediaUrls() {
  const videoUrl = findVideoUrl();
  if (videoUrl) {
    return [videoUrl];
  } else {
    return findImageUrls();
  }
}

function findMenuButtonElement() {
  return findActiveArticle()?.querySelector(
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

function findQuotedTweet() {
  return findActiveArticle()?.querySelector(
    'div[role="link"]'
  ) as HTMLElement | null;
}

function findQuoteIconElement() {
  return document.querySelector(
    'div[role="menu"] path[d="M22.132 7.653c0-.6-.234-1.166-.66-1.59l-3.535-3.536c-.85-.85-2.333-.85-3.182 0L3.417 13.865c-.323.323-.538.732-.63 1.25l-.534 5.816c-.02.223.06.442.217.6.14.142.332.22.53.22.023 0 .046 0 .068-.003l5.884-.544c.45-.082.86-.297 1.184-.62l11.337-11.34c.425-.424.66-.99.66-1.59zm-17.954 8.69l3.476 3.476-3.825.35.348-3.826zm5.628 2.447c-.282.283-.777.284-1.06 0L5.21 15.255c-.292-.292-.292-.77 0-1.06l8.398-8.398 4.596 4.596-8.398 8.397zM20.413 8.184l-1.15 1.15-4.595-4.597 1.15-1.15c.14-.14.33-.22.53-.22s.388.08.53.22l3.535 3.536c.142.142.22.33.22.53s-.08.39-.22.53z"]'
  );
}

function findQuoteMenuItemElement() {
  return findQuoteIconElement()?.closest(
    'a[role="menuitem"]'
  ) as HTMLElement | null;
}

function findRetweetButtonElement() {
  return findActiveArticle()?.querySelector(
    'div[data-testid="retweet"]'
  ) as HTMLElement | null;
}

function findVideoUrl() {
  return findVideoUrlFromOptionalArticleElement(findActiveArticle());
}

function findVideoUrlFromOptionalArticleElement(
  optionalArticleElement: Element | undefined | null
) {
  const url = optionalArticleElement
    ?.querySelector("video")
    ?.getAttribute("src");
  return url && !url.startsWith("blob:") ? url : null;
}
