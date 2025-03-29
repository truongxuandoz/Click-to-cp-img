document.addEventListener('DOMContentLoaded', function() {
  const selectButton = document.getElementById('selectMode');
  const statusText = document.getElementById('statusText');
  let isSelectionMode = false;

  // Load saved state
  chrome.storage.local.get(['selectionMode'], function(result) {
    isSelectionMode = result.selectionMode || false;
    updateButtonState();
  });

  function updateButtonState() {
    if (isSelectionMode) {
      selectButton.classList.add('active');
      selectButton.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
        Stop Image Selection Mode
      `;
      statusText.textContent = 'Click any image to copy its URL';
    } else {
      selectButton.classList.remove('active');
      selectButton.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V20H17V4H7M9,6H15V8H9V6M9,10H15V12H9V10M9,14H13V16H9V14Z"/>
        </svg>
        Start Image Selection Mode
      `;
      statusText.textContent = 'Click the button to start selecting images';
    }
  }

  selectButton.addEventListener('click', function() {
    isSelectionMode = !isSelectionMode;
    updateButtonState();
    
    // Save state
    chrome.storage.local.set({ selectionMode: isSelectionMode });
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleSelectionMode",
        enabled: isSelectionMode
      });
    });
  });
});
