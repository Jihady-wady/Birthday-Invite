const scene = document.querySelector('.scene');
const envelope = document.getElementById('envelope');
const audio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');

let audioStarted = false;

function canControlAudio() {
  return !!(scene && scene.classList.contains('open') && audioStarted && audio && !audio.paused);
}

function updateAudioToggleState() {
  if (!audioToggle) return;

  const enabled = canControlAudio();
  audioToggle.disabled = !enabled;
  audioToggle.classList.toggle('is-disabled', !enabled);

  if (!enabled) {
    audioToggle.textContent = 'Audio';
    audioToggle.setAttribute('aria-pressed', 'false');
    return;
  }

  audioToggle.textContent = audio.muted ? 'Unmute' : 'Mute';
  audioToggle.setAttribute('aria-pressed', String(audio.muted));
}

if (audioToggle && audio) {
  audioToggle.addEventListener('click', () => {
    if (audioToggle.disabled) return;
    audio.muted = !audio.muted;
    updateAudioToggleState();
  });
}

if (audio) {
  audio.addEventListener('play', updateAudioToggleState);
  audio.addEventListener('pause', updateAudioToggleState);
}

updateAudioToggleState();

// Play audio on first user interaction
document.addEventListener('click', () => {
  if (!audioStarted && audio) {
    audio.volume = 0;
    audio.loop = true;
    audio.play().then(() => {
      audioStarted = true;
      updateAudioToggleState();
      const targetVolume = 0.2;
      const step = 0.01;
      const fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume) {
          audio.volume = Math.min(audio.volume + step, targetVolume);
        } else {
          clearInterval(fadeInterval);
        }
      }, 80);
    }).catch(err => console.log('Autoplay prevented'));
  }
}, { once: true });

if (scene && envelope) {
  envelope.addEventListener('click', () => {
    const isOpen = scene.classList.toggle('open');
    envelope.setAttribute('aria-expanded', String(isOpen));

    if (audio && audioStarted) {
      if (isOpen && audio.paused) {
        audio.play().catch(err => console.log('Autoplay prevented'));
      }

      if (!isOpen && !audio.paused) {
        audio.pause();
      }
    }

    updateAudioToggleState();
  });
}



