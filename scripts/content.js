chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractFromImage") {
    extractTextFromImage(request.imageData);
  } else if (request.action === "extractFromArea") {
    createOverlay();
  } else if (request.action === "showError") {
    showToast(`❌ ${request.message}`, "#F44336");
  }
});

async function extractTextFromImage(imageData) {
  showToast("🔍 Analyzing image...", "#2196F3");

  try {
    // Configure Tesseract to use local files
    const workerPath = chrome.runtime.getURL("libs/tesseract-worker.min.js");
    const corePath = chrome.runtime.getURL("libs/tesseract-core.wasm.js");

    const worker = await Tesseract.createWorker("eng", 1, {
      workerPath: workerPath,
      corePath: corePath,
      logger: (m) => console.log(m),
    });

    const {
      data: { text },
    } = await worker.recognize(imageData);
    await worker.terminate();

    if (text.trim()) {
      await copyToClipboard(text);
      showToast(
        `✅ Text copied to clipboard!\n\n${text.substring(0, 100)}...`,
        "#4CAF50"
      );
    } else {
      showToast("⚠️ No text found in image", "#FF9800");
    }
  } catch (error) {
    console.error("OCR Error:", error);
    showToast("❌ Failed to extract text. Try a different image.", "#F44336");
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

function showToast(message, color) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 400px;
    white-space: pre-wrap;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

let overlay, selectionBox;
let startX,
  startY,
  isSelecting = false;
