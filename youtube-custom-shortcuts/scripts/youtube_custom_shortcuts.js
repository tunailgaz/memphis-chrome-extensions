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

function addShortcuts(play_btn, sound_btn) {
  console.log('Adding custom shortcuts to YouTube video player')
  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      sound_btn.focus()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      play_btn.focus()
    } else if (event.key === ' ') {
      // play_btn.focus()
      play_btn.click()
    }
  });
}

window.addEventListener('load', () => {
  console.log('Youtube custom shortcuts script loaded')
  let play_btn = getPlayButton()
  let sound_btn = getSoundButton()
  if (play_btn && sound_btn) {
    addShortcuts(play_btn, sound_btn);
  } else {
    let timeout_count = 0;
    let interval = setInterval(() => {
      timeout_count++;
      play_btn = getPlayButton()
      sound_btn = getSoundButton()
      // if (play_btn && sound_btn) {
      //   clearInterval(interval)
      //   addShortcuts(play_btn, sound_btn)
      // }
      if (timeout_count > 10) {
        console.log('Could not find play button and sound button')
        clearInterval(interval)
      }
    }, 500)
  }
});