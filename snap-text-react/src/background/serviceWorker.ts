
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
    id: "snaptext_extract",
    title: "SnapText: Extract text",
    contexts: ["image", "selection", "page"]
  });
});

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if(info.menuItemId === "snaptext_extract" && tab?.id) {
//         chrome.tabs.sendMessage(tab.id, { action: "extract_text" });
//         chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: (imageUrl: string) => {
//         window.postMessage(
//           { type: "START_OCR", imageUrl },
//           "*"
//         );
//       },
//       args: [info.srcUrl ?? ""]
//     });
//     }
// });

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "snaptext_extract" && tab?.id) {
    const tabId = tab.id;
    if (!tabId) return;

    if (info.srcUrl) {
      chrome.tabs.sendMessage(tabId, { 
        action: "extract_text",
        imageUrl: info.srcUrl,
        selectionText: info.selectionText
      }).catch(err => console.log(err));
    } else {
      // Capture visible tab for page/selection contexts
      chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" })
        .then(dataUrl => {
          chrome.tabs.sendMessage(tabId, { 
            action: "extract_text",
            imageUrl: dataUrl,
            selectionText: info.selectionText
          }).catch(err => console.log(err));
        })
        .catch(err => console.error("Capture failed:", err));
    }
  }
});





