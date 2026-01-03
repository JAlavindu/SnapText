
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
    id: "snaptext_extract",
    title: "SnapText: Extract text",
    contexts: ["image", "selection", "page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(info.menuItemId === "snaptext_extract" && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: "extract_text" });
        chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (imageUrl: string) => {
        window.postMessage(
          { type: "START_OCR", imageUrl },
          "*"
        );
      },
      args: [info.srcUrl ?? ""]
    });
    }
});


