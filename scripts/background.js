chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "extract-from-image",
    title: "Extract Text from This Image",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: "extract-from-area",
    title: "Extract Text from Selected Area",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (
    info.menuItemId === "extract-from-image" ||
    info.menuItemId === "extract-from-area"
  ) {
    // Trigger the overlay selection mode for both actions
    chrome.tabs.sendMessage(tab.id, {
      action: "extractFromArea",
    });
  }
});

// 3. Handle Screenshot Requests (Phase 6)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture_visible_tab") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true; // Keep the message channel open for sendResponse
  }
});
