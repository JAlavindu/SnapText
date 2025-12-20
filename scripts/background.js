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
  } else if (request.action === "performOCR") {
    handleOCR(request, sendResponse);
    return true;
  }
});

async function handleOCR(request, sendResponse) {
  await setupOffscreenDocument("offscreen.html");
  console.log("Forwarding OCR request to offscreen document");
  // Send message to offscreen document
  chrome.runtime.sendMessage(request, (response) => {
    sendResponse(response);
  });
}

let creating; // A global promise to avoid concurrency issues
async function setupOffscreenDocument(path) {
  // Check if offscreen document already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [chrome.runtime.getURL(path)],
  });

  if (existingContexts.length > 0) {
    return;
  }

  // Create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ["BLOBS"],
      justification: "To process image data with Tesseract.js",
    });
    await creating;
    creating = null;
  }
}
