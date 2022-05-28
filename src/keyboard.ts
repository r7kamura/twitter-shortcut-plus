const ignoredKeys = new Set(["Alt", "Control", "Meta", "Shift"]);

export function detectKeyString(event: KeyboardEvent) {
  const segments = [];
  if (event.shiftKey) {
    segments.push("shift");
  }
  if (event.ctrlKey) {
    segments.push("ctrl");
  }
  if (event.altKey) {
    segments.push("alt");
  }
  if (event.metaKey) {
    segments.push("meta");
  }
  if (ignoredKeys.has(event.key)) {
    return null;
  } else {
    segments.push(event.key.toLocaleLowerCase());
    return segments.join("+");
  }
}
