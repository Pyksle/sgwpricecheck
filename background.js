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
  // Common marketing and condition terms to remove
  const termsToRemove = [
    // Marketing Terms
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
    'CLEARANCE',
    
    // Condition Descriptors
    'NEAR MINT',
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'POOR',
    'VG[+]?', // VG or VG+
    'G[+]?',  // G or G+
    'EX[+]?', // EX or EX+
    'LIKE NEW',
    'PRISTINE',
    'UNUSED',
    
    // Store/Listing Specific
    'SHIPS FREE',
    'FREE SHIPPING',
    'NO RESERVE',
    'GREAT DEAL',
    /LOT OF \d+/gi,
    /BUNDLE OF \d+/gi,
    
    // Common Verification Terms
    'VERIFIED',
    'GUARANTEED',
    'CERTIFIED',
    '100% ORIGINAL',
    'AUTHENTIC',
    
    // Size/Weight Indicators at start of title
    /^\d+(\.\d+)?[g|oz|lb|kg]\s+/i,
    /^\d+(\.\d+)?mm\s+/i,
    
    // Common ShopGoodwill Terms
    /GOODWILL/gi,
    'LOCAL PICKUP',
    'WILL SHIP',
    'AS IS',
    'READ DESC',
    'SEE DESC',
    'WITH COA',
    /w\/?COA/i,
    
    // Measurement/Size prefixes
    /^(SIZE|SZ|LENGTH|WIDTH|HEIGHT)\s*[:|-]?\s*\d+/i,
    
    // Date stamps
    /\d{1,2}\/\d{1,2}\/\d{2,4}/,
    
    // Common Abbrev.
    'W/TAG',
    'W/TAGS',
    'W/BOX',
    'W/CASE',
    
    // Material Conditions
    'PRE-OWNED',
    'PREOWNED',
    'USED',
    'UNWORN',
    'WORN',
    'COMPLETE',
    'INCOMPLETE',
    'WORKING',
    'FUNCTIONAL',
    'UNTESTED'
  ];

  let cleanedTitle = title;

  // Remove all marketing terms (case insensitive)
  termsToRemove.forEach(term => {
    if (term instanceof RegExp) {
      cleanedTitle = cleanedTitle.replace(term, '');
    } else {
      cleanedTitle = cleanedTitle.replace(new RegExp(term, 'gi'), '');
    }
  });

  // Remove any text in parentheses
  cleanedTitle = cleanedTitle.replace(/\([^)]*\)/g, '');
  
  // Remove square brackets and content
  cleanedTitle = cleanedTitle.replace(/\[[^\]]*\]/g, '');

  // Keep alphanumeric, spaces, periods, and hyphens
  cleanedTitle = cleanedTitle.replace(/[^a-zA-Z0-9\s.-]/g, '');

  // Replace multiple spaces with single space
  cleanedTitle = cleanedTitle.replace(/\s+/g, ' ');

  // Remove spaces around periods and hyphens
  cleanedTitle = cleanedTitle.replace(/\s*([.-])\s*/g, '$1');

  // Trim whitespace from start and end
  cleanedTitle = cleanedTitle.trim();

  return cleanedTitle;
}

// Listen for messages from content script
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'itemTitle') {
    lastFoundTitle = message.title;
  }
});

function processTitle(title) {
    const cleanedTitle = cleanSearchTerm(title);
    console.log('Original:', title);
    console.log('Cleaned:', cleanedTitle);

    const encodedName = cleanedTitle.replace(/\s+/g, '+');
    const ebayUrl = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${encodedName}&rt=nc&LH_Sold=1&LH_Complete=1`;
    
    browser.tabs.create({
        url: ebayUrl
    });
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    let title;
    
    if (info.menuItemId === "check-ebay-link") {
        title = info.linkText || info.linkUrl.split('/').pop();
        if (title) {
            processTitle(title);
        }
    } else if (info.menuItemId === "check-ebay-page") {
        // First try the stored title
        browser.tabs.executeScript({
            code: `sessionStorage.getItem('goodwillItemTitle')`
        }).then(result => {
            let title = result[0] || lastFoundTitle;
            if (title) {
                processTitle(title);
            }
        }).catch(err => {
            console.log('Script execution error:', err);
            // Fallback to lastFoundTitle if script fails
            if (lastFoundTitle) {
                processTitle(lastFoundTitle);
            }
        });
    }
});
