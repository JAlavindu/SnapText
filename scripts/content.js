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

function createOverlay() {
  if (document.getElementById("snaptext-overlay")) return;

  showToast("🖱️ Select area to extract text", "#2196F3");

  overlay = document.createElement("div");
  overlay.id = "snaptext-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2147483647;
    cursor: crosshair;
  `;

  // 2. Create the selection rectangle
  selectionBox = document.createElement("div");
  selectionBox.style.cssText = `
    position: absolute;
    border: 2px dashed #fff;
    background: rgba(255, 255, 255, 0.1);
    display: none;
    pointer-events: none;
  `;
  overlay.appendChild(selectionBox);
  document.body.appendChild(overlay);

  // 3. Add mouse events
  overlay.addEventListener("mousedown", onMouseDown);
  overlay.addEventListener("mousemove", onMouseMove);
  overlay.addEventListener("mouseup", onMouseUp);

  //disable scrolling
  document.body.style.overflow = "hidden";
}

function onMouseDown(e) {
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
}

function onMouseMove(e) {
  if (!isSelecting) return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
  selectionBox.style.left = `${Math.min(currentX, startX)}px`;
  selectionBox.style.top = `${Math.min(currentY, startY)}px`;
}

function onMouseUp(e) {
  isSelecting = false;

  const rect = selectionBox.getBoundingClientRect();
  const selection = {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };

  // Cleanup
  document.body.removeChild(overlay);
  document.body.style.overflow = "";

  if (selection.width > 10 && selection.height > 10) {
    requestScreenshot(selection);
  } else {
    showToast("⚠️ Selection too small, try again", "#FF9800");
  }
}
