/**
 * This function creates an observer that adds custom keyboard shortcuts to YouTube.
 * It observes the document for changes and adds the shortcuts when the necessary elements are available.
 * Once the shortcuts are added, it disconnects the observer to prevent unnecessary checks.
 * The shortcuts are only added once per page load.
 */

function triggerKeyboardEvent(element, key) {
  // find the key code for the key, it can be any key
  let keyCode = key === 'k' ? 75 : key.charCodeAt(0);
  console.log('keyCode, key', key.charCodeAt(0), key)
  const keydownEvent = new KeyboardEvent('keydown', {
    key,
    code: key,
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  });

  const keyupEvent = new KeyboardEvent('keyup', {
    key,
    code: key,
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  });

  element.dispatchEvent(keydownEvent);
  element.dispatchEvent(keyupEvent);
}

function createShortcutsObserver() {
  // Flag to check if the shortcuts have already been added
  let shortcutsAdded = false;

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
          }
        }
      });

      // Set the flag to true as the shortcuts have been added
      shortcutsAdded = true;

      // Disconnect the observer as we don't need it anymore
      observer.disconnect();

      const every_minute_ms = 60000;
      console.log('YouTube Custom Shortcuts: Adding shortcuts, disabling observer')
      setInterval(() => {
        if (playButton.getAttribute('title')?.startsWith('Pause')) {
          console.log('YouTube Custom Shortcuts: Triggering play/pause event');
          triggerKeyboardEvent(playButton, 'k');
          setTimeout(() => {
            triggerKeyboardEvent(playButton, 'k');
          }, 50);
        }
      }, every_minute_ms * 25);
    }
  });

  // Start observing the document for changes
  observer.observe(document, { childList: true, subtree: true });
}


// Call the function to start the observer
createShortcutsObserver();