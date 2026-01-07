// Listen for the message from background/serviceWorker.ts
// chrome.runtime.onMessage.addListener((request) => {
//   if (request.action === "extract_text") {
//     console.log("SnapText: Command received", request);

//     // Communicate this to your React App (which is likely listening on window)
//     window.postMessage(
//         { 
//             type: "START_OCR", 
//             imageUrl: request.imageUrl,
//             selection: request.selection 
//         },
//         "*"
//     );
//   }
// });

import { mountOverlay } from "./overlay/OverlayRoot";

window.addEventListener("message", (event) => {
  if (event.data?.type === "START_OCR") {
    mountOverlay(event.data.imageUrl);
  }
});
