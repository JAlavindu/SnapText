chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractFromImage") {
    extractTextFromImage(request.imageData);
  } else if (request.action === "extractFromArea") {
    showToast("Area selection coming in Phase 6!", "#2196F3");
  } else if (request.action === "showError") {
    showToast(`❌ ${request.message}`, "#F44336");
  }
});

async function extractTextFromImage(imageData) {
  showToast("🔍 Analyzing image...", "#2196F3");

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageData, "eng", {
      logger: (m) => console.log(m),
    });

    if (text.trim()) {
      await navigator.clipboard.writeText(text);
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
