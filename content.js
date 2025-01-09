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
