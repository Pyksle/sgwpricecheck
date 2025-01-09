let lastTitle = '';

function findItemTitle() {
    console.log('Finding item title...');
    const titleElement = document.querySelector('.mb-4.d-none.d-md-block.ng-star-inserted');
    if (titleElement) {
        const title = titleElement.textContent.trim();
        if (title !== lastTitle) {
            lastTitle = title;
            console.log('Found new title:', title);
            // Try both methods of communication
            try {
                browser.runtime.sendMessage({
                    type: 'itemTitle',
                    title: title
                }).catch(err => console.log('Send message error:', err));
                
                // Also store in sessionStorage as backup
                sessionStorage.setItem('goodwillItemTitle', title);
            } catch (e) {
                console.log('Error in title handling:', e);
            }
        }
    }
}

// Run more frequently and add error handling
try {
    findItemTitle();
    
    const observer = new MutationObserver((mutations) => {
        try {
            findItemTitle();
        } catch (e) {
            console.log('Observer error:', e);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Backup interval check
    setInterval(findItemTitle, 1000);
} catch (e) {
    console.log('Setup error:', e);
}
