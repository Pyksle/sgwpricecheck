// manifest.json
{
  "manifest_version": 2,
  "name": "Goodwill eBay Price Checker",
  "version": "1.1",
  "description": "Right-click to check eBay prices for Goodwill items",
  "permissions": [
    "contextMenus",
    "activeTab",
    "*://*.shopgoodwill.com/*"
  ],
  "background": {
    "scripts": ["background.js"]
  },
  "content_scripts": [
    {
      "matches": ["*://*.shopgoodwill.com/item/*"],
      "js": ["content.js"]
    }
  ]
}

// background.js
let lastFoundTitle = null;

// Create context menu items
browser.contextMenus.create({
  id: "check-ebay-link",
  title: "🔍 Compare on eBay",
  contexts: ["link"],
  documentUrlPatterns: ["*://*.shopgoodwill.com/*"]
});

browser.contextMenus.create({
  id: "check-ebay-page",
  title: "🔍 Compare This Item on eBay",
  contexts: ["page"],
  documentUrlPatterns: ["*://*.shopgoodwill.com/item/*"]
});

function cleanSearchTerm(title) {
  // Previous cleaning function remains the same
  const termsToRemove = [
    'TESTED',
    'LAST CHANCE',
    'NWT',
    'NEW',
    /\d+% OFF/g,
    'SEALED',
    'AUTHENTIC',
    'GENUINE',
    'BRAND NEW',
    'MINT',
    'RARE',
    'LIMITED EDITION',
    'EXCLUSIVE',
    'SALE',
    'HOT DEAL',
    'CLEARANCE'
  ];

  let cleanedTitle = title;

  termsToRemove.forEach(term => {
    if (term instanceof RegExp) {
      cleanedTitle = cleanedTitle.replace(term, '');
    } else {
      cleanedTitle = cleanedTitle.replace(new RegExp(term, 'gi'), '');
    }
  });

  cleanedTitle = cleanedTitle.replace(/\([^)]*\)/g, '');
  cleanedTitle = cleanedTitle.replace(/[^a-zA-Z0-9\s.-]/g, '');
  cleanedTitle = cleanedTitle.replace(/\s+/g, ' ');
  cleanedTitle = cleanedTitle.replace(/\s*([.-])\s*/g, '$1');
  cleanedTitle = cleanedTitle.trim();

  return cleanedTitle;
}

// Listen for messages from content script
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'itemTitle') {
    lastFoundTitle = message.title;
  }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  let title;
  
  if (info.menuItemId === "check-ebay-link") {
    title = info.linkText || info.linkUrl.split('/').pop();
  } else if (info.menuItemId === "check-ebay-page") {
    title = lastFoundTitle;
  }

  if (title) {
    const cleanedTitle = cleanSearchTerm(title);
    console.log('Original:', title);
    console.log('Cleaned:', cleanedTitle);

    const encodedName = cleanedTitle.replace(/\s+/g, '+');
    const ebayUrl = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${encodedName}&rt=nc&LH_Sold=1&LH_Complete=1`;
    
    browser.tabs.create({
      url: ebayUrl
    });
  }
});

// content.js
function findItemTitle() {
  const titleElement = document.querySelector('.mb-4.d-none.d-md-block.ng-star-inserted');
  if (titleElement) {
    const title = titleElement.textContent.trim();
    browser.runtime.sendMessage({
      type: 'itemTitle',
      title: title
    });
  }
}

// Run initially and on any DOM changes
findItemTitle();
const observer = new MutationObserver(findItemTitle);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
