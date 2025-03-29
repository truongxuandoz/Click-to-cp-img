# Image URL Copier Extension

This Chrome extension allows you to copy image URLs from any website, even those that normally prevent this action.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this directory

## Usage

1. Right-click on any image on any website
2. Select "Copy Image URL" from the context menu
3. The image URL will be copied to your clipboard
4. A small notification will appear confirming the copy action

## Files
- `manifest.json`: Extension configuration
- `background.js`: Handles context menu creation and click events
- `content.js`: Handles clipboard operations and notifications
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons
