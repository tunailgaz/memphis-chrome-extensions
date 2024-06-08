/**
 * This function creates an observer that adds custom keyboard shortcuts to YouTube.
 * It observes the document for changes and adds the shortcuts when the necessary elements are available.
 * Once the shortcuts are added, it disconnects the observer to prevent unnecessary checks.
 * The shortcuts are only added once per page load.
 */
function createShortcutsObserver() {
  // Flag to check if the shortcuts have already been added
  let shortcutsAdded = false;
  const play_pause_event = new KeyboardEvent('keypress', {which: 'k'.charCodeAt(0)});

  /**
   * The observer checks for changes in the document.
   * If the shortcuts have not been added yet, it tries to add them.
   */
  const observer = new MutationObserver(() => {
    // If the shortcuts have already been added, we don't need to do anything
    if (shortcutsAdded) return;

    // Get the necessary elements from the page
    const playButton = document.querySelector('.ytp-play-button.ytp-button');
    const soundButton = document.querySelector('.ytp-mute-button.ytp-button');
    const searchButton = document.querySelector('form#search-form input#search');

    // If all the necessary elements are available, we can add the shortcuts
    if (playButton && soundButton && searchButton) {

      // Add the event listener for the keyboard shortcuts
      document.addEventListener('keydown', (event) => {
        // If the search field is not focused
        if (searchButton !== document.activeElement) {
          // If the user presses the up or down arrow, focus the sound button
          if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            soundButton.focus();
          }
          // If the user presses the left or right arrow or space, focus the play button
          else if (['ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
            playButton.focus();
            if (event.key === ' ') {
              // "k" key is used to play/pause the video, so we need to simulate it
              playButton.dispatchEvent(play_pause_event);
            }
          }
        }
      });

      // Set the flag to true as the shortcuts have been added
      shortcutsAdded = true;

      // Disconnect the observer as we don't need it anymore
      observer.disconnect();
      console.log('YouTube Custom Shortcuts: Adding shortcuts, disabling observer')
    }
  });

  // Start observing the document for changes
  observer.observe(document, {childList: true, subtree: true});
}

// Call the function to start the observer
createShortcutsObserver();