// Create the context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extract-text",
    title: "Extract Text with SnapText",
    contexts: ["all"],
  });
});

// Listen for clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extract-text") {
    // Send a message to the content script to extract text
    chrome.tabs.sendMessage(tab.id, { action: "extractText" });
  }
});
