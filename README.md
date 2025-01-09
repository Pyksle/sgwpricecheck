# ShopGoodwill eBay Price Checker

A Firefox extension that adds a convenient way to check eBay prices for items you find on shopgoodwill.com. Perfect for quick price comparisons and market research.

## Features

- 🔍 Compare prices in two ways:
  - Right-click any item link to check similar items on eBay
  - Right-click anywhere on an item's page to compare that specific item
- 📊 Searches eBay's completed/sold listings for accurate price comparisons
- 🧹 Automatically cleans up search terms by removing marketing language and unnecessary text
- 🚀 Lightweight and fast - no impact on browsing performance

## Installation

### Temporary Installation (Development)
1. Download or clone this repository
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension directory and select `manifest.json`

### Permanent Installation
https://addons.mozilla.org/en-US/firefox/addon/sgwpricecheck/

## Usage

### On Search Results/Listing Pages:
1. Visit [shopgoodwill.com](https://shopgoodwill.com)
2. Right-click on any item title/link
3. Select "🔍 Compare on eBay" from the context menu

### On Individual Item Pages:
1. Open any item page on shopgoodwill.com
2. Right-click anywhere on the page
3. Select "🔍 Compare This Item on eBay"

In both cases, a new tab will open showing eBay's completed/sold listings for that item.

## How It Works

The extension:
1. Monitors for right-clicks on shopgoodwill.com
2. Captures the item title from either:
   - The clicked link text
   - The item page's title
3. Cleans up the title by removing:
   - Marketing terms (TESTED, LAST CHANCE, NWT, etc.)
   - Quality indicators (Near Mint, VG+, etc.)
   - Percentage discounts
   - Special characters
   - Parenthetical text
   - Store-specific references
4. Creates an eBay search URL using the cleaned title
5. Opens the search in a new tab

## Files

- `manifest.json` - Extension configuration
- `background.js` - Core functionality and context menu handling
- `content.js` - Page title extraction for item pages

## Requirements

- Firefox Browser (Latest version recommended)

## Development

Want to contribute? Great! Here are some ways you can help:
- Add more marketing terms to the cleaning function
- Improve search term processing
- Add additional features
- Support for other auction/shopping sites

## Credits

Developed by Claude and Human (2024)

## License

MIT License - Feel free to use and modify as needed.

## Note

This is not an official ShopGoodwill or eBay tool. It is a community-created utility to help with price comparison.
