/**
 * Audio Management System
 * Handles background music and sound effects with proper Web Audio API integration.
 * All audio is created and managed programmatically via the Web Audio API.
 */

const AudioManager = (() => {
  const state = {
    backgroundMusic: null,
    soundEffects: {},
    musicVolume: 0.4,
    sfxVolume: 0.3,
    isMuted: false,
    audioContext: null,
    masterGain: null,
    isInitialized: false
  };

  // Initialize Audio Context and master gain node
  const initAudioContext = () => {
    if (state.isInitialized) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      try {
        state.audioContext = new AudioContext();
        state.masterGain = state.audioContext.createGain();
        state.masterGain.connect(state.audioContext.destination);
        state.masterGain.gain.value = state.musicVolume;
        state.isInitialized = true;
      } catch (err) {
        console.warn('AudioContext initialization failed:', err);
      }
    }
  };

  // Resume audio context (required for iOS)
  const resumeAudioContext = () => {
    if (state.audioContext) {
      if (state.audioContext.state === 'suspended') {
        state.audioContext.resume().catch(err => {
          console.warn('Audio context resume failed:', err);
        });
      }
    }
  };

  // Create an audio element with proper error handling
  const createAudioElement = (src, options = {}) => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.volume = options.volume || state.musicVolume;
    audio.loop = options.loop !== undefined ? options.loop : false;
    
    // Set source with proper mime type detection
    if (src.endsWith('.mp3')) {
      audio.src = src;
    } else if (src.endsWith('.m4a')) {
      audio.src = src;
      audio.type = 'audio/mp4';
    } else {
      audio.src = src;
    }
    
    // Prevent audio from being added to the DOM
    audio.style.display = 'none';
    
    // Connect to Web Audio API for better control
    if (state.audioContext && state.masterGain) {
      try {
        // Only connect once per audio element
        if (!audio.sourceNode) {
          const source = state.audioContext.createMediaElementSource(audio);
          source.connect(state.masterGain);
          audio.sourceNode = source;
        }
      } catch (err) {
        // Source may already be created; silently continue
        console.warn('Could not connect audio to context:', err);
      }
    }
    
    return audio;
  };

  // Play background music with robust error handling
  const playBackgroundMusic = () => {
    if (state.isMuted) return;
    
    // Ensure context is initialized and resumed
    if (!state.isInitialized) {
      initAudioContext();
    }
    resumeAudioContext();
    
    if (!state.backgroundMusic) {
      // Use M4A audio file
      state.backgroundMusic = createAudioElement('assets/audio/wedding-music.m4a', {
        volume: state.musicVolume,
        loop: true
      });
    }

    if (state.backgroundMusic && state.backgroundMusic.paused) {
      state.backgroundMusic.currentTime = 0;
      const playPromise = state.backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Background music started successfully');
          })
          .catch(err => {
            console.warn('Background music playback failed:', err);
            // Try to load fresh if play() fails
            if (state.backgroundMusic && state.backgroundMusic.src) {
              state.backgroundMusic.load();
              setTimeout(playBackgroundMusic, 500);
            }
          });
      }
    }
  };

  // Stop background music
  const stopBackgroundMusic = () => {
    if (state.backgroundMusic && !state.backgroundMusic.paused) {
      state.backgroundMusic.pause();
      state.backgroundMusic.currentTime = 0;
    }
  };

  // Fade background music in/out
  const fadeMusic = (targetVolume, duration = 1000) => {
    if (!state.backgroundMusic) return;

    const startVolume = state.backgroundMusic.volume;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      state.backgroundMusic.volume = startVolume + (targetVolume - startVolume) * progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        state.backgroundMusic.volume = targetVolume;
        if (targetVolume === 0) {
          state.backgroundMusic.pause();
        }
      }
    };

    fade();
  };

  // Play sound effect (one-shot)
  const playSoundEffect = (name, src) => {
    if (state.isMuted) return;

    if (!state.isInitialized) {
      initAudioContext();
    }
    resumeAudioContext();

    const sfx = createAudioElement(src, {
      volume: state.sfxVolume,
      loop: false
    });

    const playPromise = sfx.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(`Sound effect "${name}" started`);
        })
        .catch(err => {
          console.warn(`Sound effect "${name}" failed to play:`, err);
        });
    }

    // Clean up after playback
    sfx.addEventListener('ended', () => {
      sfx.pause();
      sfx.currentTime = 0;
    }, { once: true });

    return sfx;
  };

  // Set master volume
  const setMusicVolume = (volume) => {
    state.musicVolume = Math.max(0, Math.min(1, volume));
    if (state.masterGain) {
      state.masterGain.gain.value = state.musicVolume;
    }
    if (state.backgroundMusic) {
      state.backgroundMusic.volume = state.musicVolume;
    }
  };

  const setSoundEffectVolume = (volume) => {
    state.sfxVolume = Math.max(0, Math.min(1, volume));
  };

  // Toggle mute
  const toggleMute = () => {
    state.isMuted = !state.isMuted;
    if (state.isMuted) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
    return state.isMuted;
  };

  // Get mute state
  const isMuted = () => state.isMuted;

  return {
    init: initAudioContext,
    resume: resumeAudioContext,
    playBackgroundMusic,
    stopBackgroundMusic,
    fadeMusic,
    playSoundEffect,
    setMusicVolume,
    setSoundEffectVolume,
    toggleMute,
    isMuted
  };
})();

// Auto-initialize on first user interaction
document.addEventListener('click', () => {
  AudioManager.init();
  AudioManager.resume();
  AudioManager.playBackgroundMusic();
}, { once: true });

document.addEventListener('touchstart', () => {
  AudioManager.init();
  AudioManager.resume();
  AudioManager.playBackgroundMusic();
}, { once: true });
