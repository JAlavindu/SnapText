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
  if (info.menuItemId === "extract-from-image") {
    try {
      // Fetch the image in the background script (bypasses CORS)
      const response = await fetch(info.srcUrl);
      const blob = await response.blob();

      // Convert blob to base64 to send to content script
      const reader = new FileReader();
      reader.onloadend = () => {
        chrome.tabs.sendMessage(tab.id, {
          action: "extractFromImage",
          imageData: reader.result, // base64 string
        });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to fetch image:", error);
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        message: "Failed to load image",
      });
    }
  } else if (info.menuItemId === "extract-from-area") {
    chrome.tabs.sendMessage(tab.id, {
      action: "extractFromArea",
    });
  }
});
