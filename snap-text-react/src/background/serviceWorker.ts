
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
    if (info.srcUrl) {
      chrome.tabs.sendMessage(tab.id, { 
        action: "extract_text",
        imageUrl: info.srcUrl,
        selectionText: info.selectionText
      }).catch(err => console.log(err));
    } else {
      captureAndSend(tab);
    }
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    captureAndSend(tab);
  }
});

async function captureAndSend(tab: chrome.tabs.Tab) {
    if(!tab.id) return;
    try {
        const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
        await chrome.tabs.sendMessage(tab.id, { 
            action: "extract_text",
            imageUrl: dataUrl
        });
    } catch (err) {
        console.error("Capture failed:", err);
    }
}





