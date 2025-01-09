console.log('Content script starting...'); // Debug log

// Create a visible debug element
function addDebugElement(text) {
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        background: red;
        color: white;
        padding: 5px;
        z-index: 999999;
        font-size: 12px;
    `;
    debugDiv.textContent = text;
    document.body.appendChild(debugDiv);
}

let lastTitle = '';
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 20; // Increased attempts

function findItemTitle() {
    console.log('Attempting to find title...'); // Debug log
    const titleElement = document.querySelector('.mb-4.d-none.d-md-block.ng-star-inserted');
    if (titleElement) {
        const title = titleElement.textContent.trim();
        if (title !== lastTitle) {
            lastTitle = title;
            addDebugElement('Title found: ' + title); // Visual debug
            try {
                browser.runtime.sendMessage({
                    type: 'itemTitle',
                    title: title
                });
                sessionStorage.setItem('goodwillItemTitle', title);
                return true;
            } catch (e) {
                console.error('Error:', e);
                addDebugElement('Error: ' + e.message); // Visual debug
            }
        }
        return true;
    }
    return false;
}

function initializeWithRetry() {
    if (!findItemTitle() && initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
        initializationAttempts++;
        addDebugElement('Attempt ' + initializationAttempts); // Visual debug
        setTimeout(initializeWithRetry, 250); // More frequent attempts
    }
}

// Execute script when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}

function setup() {
    console.log('Setup starting...'); // Debug log
    addDebugElement('Setup starting'); // Visual debug

    try {
        // Start immediately
        initializeWithRetry();
        
        // Set up observer
        const observer = new MutationObserver((mutations) => {
            findItemTitle();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Regular check
        setInterval(findItemTitle, 500);

        // Also try on full load
        window.addEventListener('load', initializeWithRetry);

        // And after a delay
        setTimeout(initializeWithRetry, 1000);
        setTimeout(initializeWithRetry, 2000);
        setTimeout(initializeWithRetry, 3000);
    } catch (e) {
        console.error('Setup error:', e);
        addDebugElement('Setup error: ' + e.message); // Visual debug
    }
}
