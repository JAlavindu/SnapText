chrome.runtime.onMessage.addListenere((request, sender, sendResponse) => {
  if (request.action === "startSelection") {
    console.log("Extract Text command received!");
    alert("Ready to select area! (Logic coming soon)");
  }
});
