/* By default, if 'focus' on video progress, up/down keys act forward/backward,
which is annoying... This script adds custom shortcuts to YouTube video player.
 ArrowUp/ArrowDown: Focus on sound button
 ArrowLeft/ArrowRight: Focus on play button
*/

function getPlayButton() {
  return document.querySelector('.ytp-play-button.ytp-button');
}

function getSoundButton() {
  return document.querySelector('.ytp-mute-button.ytp-button');
}

function getSearchButton() {
  return document.querySelector('input#search.ytd-searchbox');
}

function addShortcuts(play_btn, sound_btn, search_btn) {
  console.log('Adding custom shortcuts to YouTube video player')
  document.addEventListener('keydown', function (event) {
    if(search_btn !== document.activeElement) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sound_btn.focus()
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        play_btn.focus()
      } else if (event.key === ' '){
        sound_btn.focus() // To prevent 'space' key from toggling play/pause
        play_btn.click()
      }
    }

  });
}

window.addEventListener('load', () => {
  console.log('Youtube custom shortcuts script loaded')
  let play_btn = getPlayButton()
  let sound_btn = getSoundButton()
  let search_btn = getSearchButton()
  if (play_btn && sound_btn && search_btn) {
    addShortcuts(play_btn, sound_btn, search_btn);
  } else {
    let timeout_count = 0;
    let interval = setInterval(() => {
      timeout_count++;
      play_btn = getPlayButton()
      sound_btn = getSoundButton()
      search_btn = getSearchButton()
      if (play_btn && sound_btn && search_btn) {
        clearInterval(interval)
        addShortcuts(play_btn, sound_btn, search_btn)
      }
      if (timeout_count > 10) {
        console.log('Could not find play button and sound button')
        clearInterval(interval)
      }
    }, 500)
  }
});