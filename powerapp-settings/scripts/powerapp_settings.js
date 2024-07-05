const DEFAULT_VOLUME_PERCENTAGE = 5;

const sliderBar = document.querySelector('#header .bottomLine .volumeContainer .bar');
const sliderHandle = sliderBar.querySelector('span.ui-slider-handle');

// Function to simulate a keyboard event
function triggerKeyboardEvent(element, key) {
  const keyCode = key === 'ArrowUp' ? 38 : 40; // ArrowUp: 38, ArrowDown: 40

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

// Function to set the volume (value between 0 and 100)
function setVolume(targetVolume) {
  targetVolume = Math.max(0, Math.min(targetVolume, 100));

  sliderHandle.focus();

  let currentVolume = parseInt(sliderHandle.style.left, 10);
  const step = 1;
  const diff = targetVolume - currentVolume;
  const key = diff > 0 ? 'ArrowUp' : 'ArrowDown';
  const steps = Math.abs(diff / step);

  for (let i = 0; i < steps; i++) {
    triggerKeyboardEvent(sliderHandle, key);
  }
}

// Function to create an observer for adding shortcuts
function createShortcutsObserver() {
  let shortcutsAdded = false;

  const observer = new MutationObserver(() => {
    if (shortcutsAdded) return;

    if (sliderHandle) {
      document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
          sliderHandle.focus();
        }
      });

      shortcutsAdded = true;
      observer.disconnect();
      console.log(`Powerapp Settings: Adding shortcuts, setting volume to ${DEFAULT_VOLUME_PERCENTAGE}, disabling observer`);
      setVolume(DEFAULT_VOLUME_PERCENTAGE);
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}

createShortcutsObserver();
