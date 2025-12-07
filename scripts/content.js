chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    console.log("Command received!");

    // Create a toast notification
    const toast = document.createElement("div");
    toast.textContent = "✅ SnapText is working! Ready to extract text.";
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);

    // Remove after 2 seconds
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }
});
