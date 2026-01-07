
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

// ...existing code...
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(info.menuItemId === "snaptext_extract" && tab?.id) {
        // Send a single message with all necessary data
        chrome.tabs.sendMessage(tab.id, { 
            action: "extract_text",
            imageUrl: info.srcUrl || null,
            selection: info.selectionText || null
        }).catch((err) => {
            // Handle case where content script isn't ready
            console.warn("Could not send message to tab. Is the content script loaded?", err);
        });
    }
});


