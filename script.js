const scene = document.querySelector('.scene');
const envelope = document.getElementById('envelope');
const audio = document.getElementById('bgAudio');

let audioStarted = false;

// Play audio on first user interaction
document.addEventListener('click', () => {
  if (!audioStarted && audio) {
    audio.volume = 0;
    audio.loop = true;
    audio.play().then(() => {
      audioStarted = true;
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
  });
}