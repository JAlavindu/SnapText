chrome.runtime.onInstalled.addListener(() => {
  // Context menu for images
  chrome.contextMenus.create({
    id: "extract-from-image",
    title: "Extract Text from This Image",
    contexts: ["image"],
  });

  // Context menu for selecting screen area
  chrome.contextMenus.create({
    id: "extract-from-area",
    title: "Extract Text from Selected Area",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "extract-from-image") {
    // Send the image URL to content script
    chrome.tabs.sendMessage(tab.id, {
      action: "extractFromImage",
      imageUrl: info.srcUrl,
    });
  } else if (info.menuItemId === "extract-from-area") {
    chrome.tabs.sendMessage(tab.id, {
      action: "extractFromArea",
    });
  }
});
