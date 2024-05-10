/* By default, if 'focus' on video progress, up/down keys act forward/backward,
which is annoying... This script adds custom shortcuts to YouTube video player.
 ArrowUp/ArrowDown: Focus on sound button
 ArrowLeft/ArrowRight: Focus on play button
*/


function addShortcuts(play_btn, sound_btn, search_btn) {
  console.log('Adding custom shortcuts to YouTube video player')
  document.addEventListener('keydown', function (event) {
    if (search_btn !== document.activeElement) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sound_btn.focus()
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        play_btn.focus()
      } else if (event.key === ' ') {
        sound_btn.focus() // To prevent 'space' key from toggling play/pause
        play_btn.click()
      }
    }
  });
}

function querySelectorButtons() {
  return {
    play_btn: document.querySelector('.ytp-play-button.ytp-button'),
    sound_btn: document.querySelector('.ytp-mute-button.ytp-button'),
    search_btn: document.querySelector('form#search-form input#search')
  }
}

function getButtonsAsync() {
  return new Promise((resolve, reject) => {
    const {play_btn, sound_btn, search_btn} = querySelectorButtons()
    if (play_btn && sound_btn && search_btn) {
      resolve({play_btn, sound_btn, search_btn})
    } else {
      let timeout_count = 0;
      let interval = setInterval(() => {
        timeout_count++;
        const {play_btn, sound_btn, search_btn} = querySelectorButtons()
        if (play_btn && sound_btn && search_btn) {
          clearInterval(interval)
          resolve({play_btn, sound_btn, search_btn})
        }
        if (timeout_count > 100) {
          console.log('Could not find play button and sound button')
          clearInterval(interval)
          reject('Could not find play button and sound button')
        }
      }, 150)
    }
  })
}

window.addEventListener('load', () => {
  console.log('Youtube custom shortcuts script loaded')
  getButtonsAsync().then(({play_btn, sound_btn, search_btn}) => {
    addShortcuts(play_btn, sound_btn, search_btn)
  }).catch((error) => {
    console.log(error)
  })
});

