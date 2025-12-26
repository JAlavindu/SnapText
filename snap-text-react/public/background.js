chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "snaptext_extract",
    title: "SnapText: Extract text",
    contexts: ["image", "selection", "page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;
  // send the context info to a content script (handle it in your content script)
  chrome.tabs.sendMessage(tab.id, { action: "snaptext_extract", info });
});