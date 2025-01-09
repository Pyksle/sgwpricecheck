let lastTitle = '';
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 10;

function findItemTitle() {
    const titleElement = document.querySelector('.mb-4.d-none.d-md-block.ng-star-inserted');
    if (titleElement) {
        const title = titleElement.textContent.trim();
        if (title !== lastTitle) {
            lastTitle = title;
            console.log('Found title:', title);
            try {
                browser.runtime.sendMessage({
                    type: 'itemTitle',
                    title: title
                }).catch(err => console.log('Send message error:', err));
                
                // Store in sessionStorage as backup
                sessionStorage.setItem('goodwillItemTitle', title);
                return true; // Successfully found and processed title
            } catch (e) {
                console.log('Error in title handling:', e);
            }
        }
        return true; // Title found but unchanged
    }
    return false; // Title not found
}

function initializeWithRetry() {
    if (!findItemTitle() && initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
        initializationAttempts++;
        console.log(`Initialization attempt ${initializationAttempts}...`);
        setTimeout(initializeWithRetry, 500); // Try again in 500ms
    }
}

// Initial setup with retry mechanism
try {
    // Immediate first attempt
    initializeWithRetry();
    
    // Set up observer for future changes
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

    // Backup check every second
    setInterval(findItemTitle, 1000);

    // Also try to initialize when the page is fully loaded
    window.addEventListener('load', () => {
        console.log('Window load event - attempting title find');
        initializeWithRetry();
    });

    // And when Angular might be done
    setTimeout(() => {
        console.log('Delayed initialization attempt');
        initializeWithRetry();
    }, 2000);
} catch (e) {
    console.log('Setup error:', e);
}
