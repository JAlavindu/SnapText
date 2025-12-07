chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractFromImage") {
    extractTextFromImage(request.imageUrl);
  } else if (request.action === "extractFromArea") {
    showToast("Area selection coming in Phase 6!", "#2196F3");
  }
});

async function extractTextFromImage(imageUrl) {
  showToast("🔍 Analyzing image...", "#2196F3");

  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => console.log(m), // Progress logs
    });

    if (text.trim()) {
      // Copy to clipboard
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
    showToast("❌ Failed to extract text", "#F44336");
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
