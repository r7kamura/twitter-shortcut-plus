import { openUrlInBackground, openUrlInForeground } from "./tab";

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

function findImageUrlsFromListView() {
  return Array.from(
    document.activeElement?.querySelectorAll('img[alt="画像"]') || []
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

function findMediaUrls() {
  return [...findImageUrlsFromDetailView(), ...findImageUrlsFromListView()].map(
    convertRawImageUrlToOriginalImageUrl
  );
}
