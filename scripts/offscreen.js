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

    console.log("Initializing Tesseract...");
    console.log(
      "Using workerPath:",
      chrome.runtime.getURL("libs/tesseract-worker.min.js")
    );

    console.log(
      "workerPath:",
      chrome.runtime.getURL("libs/tesseract-worker.min.js")
    );
    console.log(
      "corePath:",
      chrome.runtime.getURL("libs/tesseract-core.wasm.js")
    );

    // Patch the default workerSrc to your local file
    window.Tesseract = window.Tesseract || {};
    window.Tesseract.workerPath = chrome.runtime.getURL(
      "libs/tesseract-worker.min.js"
    );
    window.Tesseract.corePath = chrome.runtime.getURL(
      "libs/tesseract-core.wasm.js"
    );

    // Use explicit initialization flow which is more robust across versions
    const worker = await Tesseract.createWorker({
      workerPath: chrome.runtime.getURL("libs/tesseract-worker.min.js"),
      corePath: chrome.runtime.getURL("libs/tesseract-core.wasm.js"),
      logger: (m) => console.log(m),
    });

    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    console.log("Recognizing text...");
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
