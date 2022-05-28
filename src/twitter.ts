import { openUrlInBackground, openUrlInForeground } from "./tab";

export function addActivityUserColumn() {
  findActivityUserLink()?.click();
  addDisplayedUserColumn();
}

export function addAuthorColumn() {
  findAuthorLink()?.click();
  addDisplayedUserColumn();
}

export function deleteTweet() {
  findCommandsMenuLink()?.click();
  const link = findDropdownDeleteLink();
  link?.dispatchEvent(createMouseOverEvent());
  link?.click();
}

export function downloadMedia() {
  const urls = findMediaUrls();
  if (urls.length > 0) {
    download(urls);
  }
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

export function browse() {
  const url = findUrl();
  if (url) {
    openUrlInForeground(url);
  }
}

export function browseInBackground() {
  const url = findUrl();
  if (url) {
    openUrlInBackground(url);
  }
}

export function browseAuthor() {
  const url = findAuthorUrl();
  if (url) {
    openUrlInForeground(url);
  }
}

export function browseAuthorInBackground() {
  const url = findAuthorUrl();
  if (url) {
    openUrlInBackground(url);
  }
}

export function quote() {
  findRetweetLink()?.click();
  findModalQuoteButton()?.click();
}

export function removeColumn() {
  findColumnCommandsToggleButton()?.click();
  findColumnRemoveButton()?.click();
}

export function selectActivityUser() {
  findActivityUserLink()?.click();
}

export function selectAuthor() {
  findAuthorLink()?.click();
}

export function selectLikes() {
  findDetailLikesLabel()?.click();
}

export function selectRetweets() {
  findDetailRetweetsLabel()?.click();
}

export function selectFirstHashTag() {
  const element = document.querySelector(
    '.is-selected-tweet a[rel="hashtag"]'
  ) as HTMLElement | null;
  element?.click();
}

export function selectFirstImage() {
  const element = document.querySelector(
    ".is-selected-tweet .js-media-image-link"
  ) as HTMLElement | null;
  element?.click();
}

export function selectQuotedTweet() {
  const element = document.querySelector(
    ".is-selected-tweet .js-quote-detail"
  ) as HTMLElement | null;
  element?.click();
}

function addDisplayedUserColumn() {
  findModalTweetsButton()?.click();
  setTimeout(() => {
    findModalAddColumnButton()?.click();
    findModalDismissButton()?.click();
  }, 0);
  focusItem();
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

function createMouseOverEvent() {
  const event = document.createEvent("HTMLEvents");
  event.initEvent("mouseover", true, false);
  return event;
}

function download(urls: Array<string>) {
  chrome.runtime.sendMessage({ type: "download", payload: { urls } });
}

function findDropdownDeleteLink() {
  return document.querySelector(
    '.js-dropdown a[data-action="destroy"]'
  ) as HTMLElement | null;
}

function findModalAddColumnButton() {
  return document.querySelector(
    ".js-modal-panel .js-add-column"
  ) as HTMLElement | null;
}

function findModalDismissButton() {
  return document.querySelector(
    ".js-modal-panel .js-dismiss"
  ) as HTMLElement | null;
}

function findModalQuoteButton() {
  return document.querySelector(
    '.js-modal button[data-action="quote"]'
  ) as HTMLElement | null;
}

function findModalTweetsButton() {
  return document.querySelector(
    '.js-modal-content .js-item-launch[data-type="tweets"]'
  ) as HTMLElement | null;
}

function findActivityUserLink() {
  return document.querySelector(
    '.is-selected-tweet .activity-header a[rel="user"]'
  ) as HTMLElement | null;
}

function findColumnCommandsToggleButton() {
  return findItem()
    ?.closest(".js-column-holder")
    ?.querySelector(".js-action-header-button") as HTMLElement | null;
}

function findColumnRemoveButton() {
  return findItem()
    ?.closest(".js-column-holder")
    ?.querySelector('button[data-action="remove"]') as HTMLElement | null;
}

function findItem() {
  return document.querySelector(".is-selected-tweet") as HTMLElement | null;
}

function findAuthorLink() {
  return document.querySelector(
    '.is-selected-tweet .js-tweet a[rel="user"]'
  ) as HTMLElement | null;
}

function findDetailLikesLabel() {
  return document.querySelector(
    '.is-selected-tweet .js-tweet-stat[data-type="favoriters"]'
  ) as HTMLElement | null;
}

function findDetailRetweetsLabel() {
  return document.querySelector(
    '.is-selected-tweet .js-tweet-stat[data-type="retweeters"]'
  ) as HTMLElement | null;
}

function findCommandsMenuLink() {
  return document.querySelector(
    '.is-selected-tweet a[rel="commandsMenu"]'
  ) as HTMLElement | null;
}

function findLinkUrls() {
  return Array.from(
    document.querySelectorAll(".is-selected-tweet .js-tweet .url-ext")
  ).reduce((result, element) => {
    const url = element.getAttribute("data-full-url");
    if (url) {
      result = [...result, url];
    }
    return result;
  }, [] as string[]);
}

function findUrl() {
  return document
    .querySelector(".is-selected-tweet a[rel='url']")
    ?.getAttribute("href");
}

function findAuthorUrl() {
  return document
    .querySelector(".is-selected-tweet .js-tweet .account-link")
    ?.getAttribute("href");
}

function findGifVideoUrl() {
  return document
    .querySelector(".is-selected-tweet .js-media-gif")
    ?.getAttribute("src");
}

function findMediaUrls() {
  const videoUrl = findGifVideoUrl() || findNativeVideoUrl();
  if (videoUrl) {
    return [videoUrl];
  } else {
    return findImageUrls();
  }
}

function findSummaryImageUrls() {
  const anchors = Array.from(
    document.querySelectorAll(".is-selected-tweet .js-media-image-link[style]")
  );
  return anchors.reduce((urls: Array<string>, anchor) => {
    const style = anchor.getAttribute("style");
    const url = style?.match(/background-image:url\((?<url>.+)\)/)?.groups?.url;
    if (url) {
      urls.push(url);
    }
    return urls;
  }, []);
}

function findDetailImageUrls() {
  const images = Array.from(
    document.querySelectorAll(".is-selected-tweet .media-img")
  );
  return images.reduce((urls: Array<string>, image) => {
    const url = image.getAttribute("src");
    if (url) {
      urls.push(url);
    }
    return urls;
  }, []);
}

function findImageUrls() {
  return [...findDetailImageUrls(), ...findSummaryImageUrls()].map(
    convertRawImageUrlToOriginalImageUrl
  );
}

function findNativeVideoUrl() {
  return document
    .querySelector(".is-selected-tweet .js-media-native-video")
    ?.getAttribute("src");
}

function findRetweetLink() {
  return document.querySelector(
    '.is-selected-tweet a[rel="retweet"]'
  ) as HTMLElement | null;
}

function focusItem() {
  findItem()?.focus();
}
