// window.addEventListener('message', (event) => {
    
// });

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "extract_text") {
        // Handle the extract text action here
        console.log("Extract text action received in injector.ts");
    }
})