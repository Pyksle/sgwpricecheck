browser.contextMenus.create({
    id: "check-ebay",
    title: "🔍 Compare on eBay",
    contexts: ["link"],
    documentUrlPatterns: ["*://*.shopgoodwill.com/*"]
  });
  
  function cleanSearchTerm(title) {
    // Common marketing terms to remove sadge
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
  
    // Keep alphanumeric, spaces, periods, and hyphens, remove other special characters
    cleanedTitle = cleanedTitle.replace(/[^a-zA-Z0-9\s.-]/g, '');
  
    // Replace multiple spaces with single space
    cleanedTitle = cleanedTitle.replace(/\s+/g, ' ');
  
    // Remove spaces around periods and hyphens
    cleanedTitle = cleanedTitle.replace(/\s*([.-])\s*/g, '$1');
  
    // Trim whitespace from start and end
    cleanedTitle = cleanedTitle.trim();
  
    return cleanedTitle;
  }
  
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "check-ebay") {
      // Get the title from the link text or href
      const rawTitle = info.linkText || info.linkUrl.split('/').pop();
      
      // Clean up the title
      const cleanedTitle = cleanSearchTerm(rawTitle);
      console.log('Original:', rawTitle);
      console.log('Cleaned:', cleanedTitle);
  
      // Create eBay search URL with cleaned title
      const encodedName = cleanedTitle.replace(/\s+/g, '+');
      const ebayUrl = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${encodedName}&rt=nc&LH_Sold=1&LH_Complete=1`;
      
      // Open in new tab
      browser.tabs.create({
        url: ebayUrl
      });
    }
  });