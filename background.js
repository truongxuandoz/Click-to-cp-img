chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyImageUrl",
    title: "Copy Image URL",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyImageUrl") {
    const imageUrl = info.srcUrl;
    chrome.tabs.sendMessage(tab.id, {
      action: "copyToClipboard",
      text: imageUrl
    });
  }
});
