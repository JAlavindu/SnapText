
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
    }
});


