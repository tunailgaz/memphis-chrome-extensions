let globalShortcutsAdded = false;
let currentKeydownListener = null;
let currentObserver = null;

function triggerKeyboardEvent(element, key) {
  const keyCode = key === 'k' ? 75 : key.charCodeAt(0);
  const code = key === 'k' ? 'KeyK' : `Key${key.toUpperCase()}`;

  const eventOptions = {
    key,
    code,
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  };

  element.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
  element.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
}

function avoidAreYouStillWatching() {
  const TWENTY_MINUTES = 20 * 60 * 1000;
  const playButton = document.querySelector('.ytp-play-button.ytp-button');

  const interval = setInterval(() => {
    if (playButton?.getAttribute('title')?.startsWith('Pause')) {
      triggerKeyboardEvent(playButton, 'k');
      setTimeout(() => {
        triggerKeyboardEvent(playButton, 'k');
      }, 25);
    }
  }, TWENTY_MINUTES);

  return interval;
}

function createShortcutsObserver() {
  if (currentObserver) {
    currentObserver.disconnect();
  }

  function setupShortcuts() {
    if (currentKeydownListener) {
      console.log('Removing global shortcuts');
      document.removeEventListener('keydown', currentKeydownListener);
    }

    currentKeydownListener = (event) => {
      console.log(`Key pressed: ${event.key}`);
      const playButton = document.querySelector('.ytp-play-button.ytp-button');
      const soundButton = document.querySelector('.ytp-mute-button.ytp-button');
      const searchButton = document.querySelector('yt-searchbox')?.querySelector('input');

      if (!playButton || !soundButton || !searchButton) return;

      // Check if we're in a comment or input field
      const activeElement = document.activeElement;
      const isInputSlot = activeElement?.parentElement?.getAttribute('slot') === 'input';
      const isCommentSection = activeElement?.closest('ytd-comments');
      const isTextInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';

      if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        soundButton.focus();
      } else if (['ArrowLeft', 'ArrowRight', ' '].includes(event.key) &&
        !isInputSlot &&
        !isCommentSection &&
        !isTextInput) {
        playButton.focus();
      }
    };

    console.log('Adding global shortcuts');
    document.addEventListener('keydown', currentKeydownListener, true);
    globalShortcutsAdded = true;
    return avoidAreYouStillWatching();
  }

  currentObserver = new MutationObserver(() => {
    if (globalShortcutsAdded) {
      currentObserver.disconnect();
      return;
    }

    const playButton = document.querySelector('.ytp-play-button.ytp-button');
    const soundButton = document.querySelector('.ytp-mute-button.ytp-button');
    const searchButton = document.querySelector('yt-searchbox')?.querySelector('input');

    if (playButton && soundButton && searchButton) {
      setupShortcuts();
      currentObserver.disconnect();
    }
  });

  currentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });

  const interval = setupShortcuts();

  return () => {
    if (currentKeydownListener) {
      document.removeEventListener('keydown', currentKeydownListener);
    }
    if (currentObserver) {
      currentObserver.disconnect();
    }
    clearInterval(interval);
    globalShortcutsAdded = false;
  };
}

const cleanup = createShortcutsObserver();