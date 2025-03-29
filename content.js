let selectionMode = false;
let tooltip = null;

function createTooltip() {
  tooltip = document.createElement('div');
  tooltip.id = 'img-url-copier-tooltip';
  tooltip.textContent = 'Click to Copy URL';
  document.body.appendChild(tooltip);
}

function updateTooltipPosition(event) {
  if (!tooltip) return;
  tooltip.style.left = (event.pageX + 10) + 'px';
  tooltip.style.top = (event.pageY - 30) + 'px';
}

function getImageUrl(element) {
  // If it's an img tag, return its src
  if (element.tagName === 'IMG') {
    return element.src;
  }
  
  // Check for background-image
  const bgImage = window.getComputedStyle(element).backgroundImage;
  if (bgImage && bgImage !== 'none') {
    return bgImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
  }
  
  // Check for img element inside the div
  const imgInside = element.querySelector('img');
  if (imgInside) {
    return imgInside.src;
  }
  
  // Check for data attributes that might contain image URLs
  const possibleAttributes = ['data-src', 'data-original', 'data-url'];
  for (const attr of possibleAttributes) {
    if (element.getAttribute(attr)) {
      return element.getAttribute(attr);
    }
  }
  
  return null;
}

function copyImageUrl(url) {
  if (!url) return;
  
  navigator.clipboard.writeText(url).then(() => {
    showNotification('URL Copied!');
  }).catch(err => {
    console.error('Failed to copy URL:', err);
    showNotification('Failed to copy URL', true);
  });
}

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#f44336' : '#4CAF50'};
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 999999;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

function handleMouseMove(event) {
  if (!selectionMode) return;
  
  const element = event.target;
  const imageUrl = getImageUrl(element);
  
  if (imageUrl) {
    element.style.cursor = 'copy';
    element.classList.add('img-url-copier-hover');
    if (!tooltip) createTooltip();
    tooltip.style.display = 'block';
    updateTooltipPosition(event);
  } else {
    element.style.cursor = '';
    element.classList.remove('img-url-copier-hover');
    if (tooltip) tooltip.style.display = 'none';
  }
}

function handleMouseLeave(event) {
  const element = event.target;
  element.style.cursor = '';
  element.classList.remove('img-url-copier-hover');
  if (tooltip) tooltip.style.display = 'none';
}

function handleClick(event) {
  if (!selectionMode) return;
  
  const element = event.target;
  const imageUrl = getImageUrl(element);
  
  if (imageUrl) {
    copyImageUrl(imageUrl);
    event.preventDefault();
    event.stopPropagation();
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleSelectionMode") {
    selectionMode = request.enabled;
    
    if (!selectionMode) {
      // Reset all cursors and remove hover effects
      document.querySelectorAll('*').forEach(element => {
        element.style.cursor = '';
        element.classList.remove('img-url-copier-hover');
      });
      // Remove tooltip
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    }
  }
});

// Load saved state
chrome.storage.local.get(['selectionMode'], function(result) {
  selectionMode = result.selectionMode || false;
});

// Add event listeners
document.addEventListener('mousemove', handleMouseMove, true);
document.addEventListener('mouseleave', handleMouseLeave, true);
document.addEventListener('click', handleClick, true);
