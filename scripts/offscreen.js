chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "performOCR") {
    performOCR(request.imageData, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function performOCR(imageData, sendResponse) {
  try {
    if (typeof Tesseract === "undefined") {
      throw new Error("Tesseract library not loaded in offscreen document");
    }

    const worker = await Tesseract.createWorker("eng", 1, {
      workerPath: chrome.runtime.getURL("libs/tesseract-worker.min.js"),
      corePath: chrome.runtime.getURL("libs/tesseract-core.wasm.js"),
      logger: (m) => console.log(m),
    });

    const {
      data: { text },
    } = await worker.recognize(imageData);
    await worker.terminate();

    sendResponse({ success: true, text: text });
  } catch (error) {
    console.error("Offscreen OCR Error:", error);
    // Handle cases where error is not a standard Error object
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    sendResponse({
      success: false,
      error: errorMessage || "Unknown error in OCR worker",
    });
  }
}
