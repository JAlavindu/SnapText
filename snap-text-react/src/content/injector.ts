// Listen for the message from background/serviceWorker.ts

import { mountOverlay } from "./overlay/OverlayRoot";

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "extract_text") {
    console.log("SnapText: Command received", request);
    mountOverlay(request.imageUrl || "");
  }
});
