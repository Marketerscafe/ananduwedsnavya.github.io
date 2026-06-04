/**
 * Foundational Cinematic Interaction Logic (First Frame Tap Entry & Fog Transition)
 * Renders the first frame of the responsive video dynamically on page load.
 * Tapping anywhere starts smooth playback. At exactly 5.08s of playback, 
 * a dreamlike warm ivory cloud rolls in and dissolves seamlessly into Scene 2.
 * Scrolling after Scene 2 settles transitions into Scene 3.
 */
document.addEventListener('DOMContentLoaded', () => {
  // ─── DISABLE COPY/SELECT FEATURES ───
  // Prevent text selection and copying throughout the site
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });
  
  // Prevent copy
  document.addEventListener('copy', (e) => {
    e.preventDefault();
  });
  
  // Prevent cut
  document.addEventListener('cut', (e) => {
    e.preventDefault();
  });
  
  // Prevent right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  // Prevent keyboard shortcuts for copying/selecting
  document.addEventListener('keydown', (e) => {
    // Ctrl+C / Cmd+C (copy)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
    }
    // Ctrl+X / Cmd+X (cut)
    if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
      e.preventDefault();
    }
    // Ctrl+A / Cmd+A (select all)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
    }
  });

  // ─── LOADING SCREEN MANAGEMENT ───
  const loadingScreen = document.getElementById('loading-screen');
  let allResourcesLoaded = false;

  function hideLoadingScreen() {
    if (loadingScreen && allResourcesLoaded) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        if (loadingScreen.parentNode) {
          loadingScreen.style.display = 'none';
        }
        // Re-enable body overflow after loading complete
        document.body.style.overflow = 'auto';
      }, 600);
    }
  }

  // Keep body overflow hidden until all resources load
  document.body.style.overflow = 'hidden';

  // Wait for all resources to load using window.load event
  const onWindowLoad = () => {
    allResourcesLoaded = true;
    hideLoadingScreen();
  };

  if (document.readyState === 'complete') {
    // Already fully loaded
    onWindowLoad();
  } else {
    // Wait for window load event
    window.addEventListener('load', onWindowLoad, { once: true });
  }

  // Disable browser scroll restoration to protect art-directed text placement on reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const container = document.getElementById('cinematic-container');
  const wrapper = document.getElementById('video-wrapper');
  const video = document.getElementById('intro-video');
  
  // ─── VIDEO PLAYBACK HANDLER (User Gesture Bridge) ───
  // Ensures intro video plays on user interaction while satisfying browser autoplay policies
  const handleInitialPlay = () => {
    if (video && video.paused) {
      video.play().catch(err => {
        console.warn("Video playback was blocked or failed:", err);
      });
    }
  };

  // Satisfy browser user-gesture requirements with global listeners
  document.addEventListener('click', handleInitialPlay, { once: true });
  document.addEventListener('touchstart', handleInitialPlay, { once: true });

  const scene2 = document.getElementById('scene-2-container');
  const scene3 = document.getElementById('scene-3-container');
  const fog = document.getElementById('cinematic-transition-fog');
  const ambientLight = document.getElementById('cinematic-ambient-light');
  const causticWrapper = document.getElementById('caustic-atmosphere-wrapper');
  const causticA = document.getElementById('caustic-a');
  const causticB = document.getElementById('caustic-b');
  const s3ChampagneImg = document.getElementById('scene3-champagne-img');
  const scene4 = document.getElementById('scene-4-container');
  const s3Content = document.getElementById('scene-3-content');
  const s3ChampagneSeq = document.getElementById('scene3-champagne-sequence');
  const s4Card1 = document.getElementById('s4-card-1');
  const s4Card2 = document.getElementById('s4-card-2');
  const s4Card3 = document.getElementById('s4-card-3');

  // Arch and Scene 5 portal scroll elements
  const scene5 = document.getElementById('scene-5-container');
  const scene6 = document.getElementById('scene-6-container');
  const s6BgImage = document.getElementById('scene-6-bg-image');
  const s6GlassOverlay = document.getElementById('scene-6-glass-overlay');
  const s4ArchImg = document.getElementById('s4-arch-img');
  const s4ArchWrapper = document.getElementById('s4-arch-wrapper');
  const s4TimelineLayout = document.getElementById('s4-timeline-layout');
  const s4MainHeading = document.getElementById('s4-main-heading');
  const s4HeadingWrapper = document.getElementById('s4-heading-wrapper');
  const s4ButterfliesLayer = document.getElementById('s4-butterflies-layer');
  const butterflyInteractBtn = document.getElementById('butterfly-interact-btn');

  const venueLocationBtn = document.getElementById('venue-location-btn') || document.getElementById('s5-directions-btn');
  if (venueLocationBtn) {
    venueLocationBtn.addEventListener('click', function(e) {
      e.preventDefault();

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        window.open('https://maps.apple.com/?q=Tamara+Weddings+%26+Events', '_blank');
      } else {
        window.open('https://maps.app.goo.gl/WDpU5zQUr7oSK5Sf8', '_blank');
      }
    });
  }

  // ─── BUTTERFLY INTERACTION BUTTON ───
  let isBoxesLitMode = false;

  function preventScroll(e) {
    e.preventDefault();
  }

  function preventZoom(e) {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }

  function lockScrollAndZoom() {
    document.body.style.overflow = 'hidden';
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.documentElement.style.touchAction = 'none';
  }

  function unlockScrollAndZoom() {
    document.body.style.overflow = 'auto';
    document.removeEventListener('wheel', preventScroll);
    document.removeEventListener('touchmove', preventScroll);
    document.removeEventListener('touchstart', preventZoom);
    document.documentElement.style.touchAction = 'auto';
  }

  if (butterflyInteractBtn) {
    butterflyInteractBtn.addEventListener('click', function(e) {
      e.preventDefault();
      isBoxesLitMode = !isBoxesLitMode;

      // Toggle all-boxes-lit state on Scene 4
      if (scene4) {
        scene4.classList.toggle('all-boxes-lit');
        // Toggle underwater waves video visibility
        const underwaterVideo = document.getElementById('underwater-waves-video');
        if (underwaterVideo) {
          if (scene4.classList.contains('all-boxes-lit')) {
            underwaterVideo.style.opacity = '1';
            // Force preload the video on demand
            underwaterVideo.preload = 'auto';
            underwaterVideo.load(); // Trigger loading
            
            // Ensure video element is ready and play with promise handling
            underwaterVideo.currentTime = 0; // Reset to start
            underwaterVideo.playbackRate = 1.0; // Ensure normal speed
            underwaterVideo.muted = true; // Ensure muted for autoplay to work
            
            // Wait for video to be loadable before playing
            if (underwaterVideo.readyState >= 2) {
              // Video has metadata, try to play immediately
              const playPromise = underwaterVideo.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    console.log('Underwater video playing immediately');
                  })
                  .catch((error) => {
                    console.warn('Underwater video autoplay blocked:', error);
                    // Retry after a delay
                    setTimeout(() => {
                      underwaterVideo.play().catch(e => console.error('Video play failed:', e));
                    }, 100);
                  });
              }
            } else {
              // Wait for video to load metadata, then play
              console.log('Waiting for video to load...');
              underwaterVideo.oncanplay = () => {
                const playPromise = underwaterVideo.play();
                if (playPromise !== undefined) {
                  playPromise.catch((error) => {
                    console.warn('Underwater video play failed:', error);
                  });
                }
              };
            }
          } else {
            underwaterVideo.style.opacity = '0';
            underwaterVideo.pause();
            underwaterVideo.currentTime = 0; // Reset video when exiting mode
            // Stop preloading when exiting mode to save bandwidth
            underwaterVideo.preload = 'none';
          }
        }
        // Ensure all cards are visible and active
        if (scene4.classList.contains('all-boxes-lit')) {
          if (s4Card1) s4Card1.classList.add('active');
          if (s4Card2) s4Card2.classList.add('active');
          if (s4Card3) s4Card3.classList.add('active');
          // Lock scroll and zoom when entering boxes-lit mode
          lockScrollAndZoom();
          // Change button text to "Resume Invite"
          butterflyInteractBtn.textContent = 'Resume Invite';
          // Scroll to the last frame of Scene 4
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const targetScroll = maxScroll * 0.69; // End of Scene 4 (p ≈ 0.69)
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        } else {
          // Unlock scroll and zoom when exiting boxes-lit mode
          unlockScrollAndZoom();
          // Change button text back to "Interact with Butterfly"
          butterflyInteractBtn.textContent = 'Interact with Butterfly';
          
          // Show white fog transition immediately
          if (fog) {
            fog.classList.add('white-transition');
          }
          
          // Scroll to Scene 5 entry point to fade in Scene 5 while fading out Scene 4
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const targetScroll = maxScroll * 0.71; // Scene 5 fade-in starts (p ≈ 0.71)
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
          
          // Fade out white fog after 1.5s to reveal Scene 5
          setTimeout(() => {
            if (fog) {
              fog.classList.add('fade-out');
            }
          }, 1500);
          
          // Remove fog classes after fade is complete
          setTimeout(() => {
            if (fog) {
              fog.classList.remove('white-transition', 'fade-out');
            }
          }, 3500);
        }
      }
    });
  }

  // ─── CHAMPAGNE IMAGE SEQUENCE PRELOADER & CACHE ───
  // Advanced caching system with memory limits, LRU eviction, and directional preloading
  const preloadedImages = {};
  const MAX_CACHE_FRAMES = 50;  // Keep ~50MB of frames in memory (assuming ~1MB per frame)
  let lastAccessOrder = {};     // Track frame access time for LRU eviction
  let accessCounter = 0;        // Monotonic counter for LRU tracking
  let batchPreloadScheduled = false;
  let lastScrollDirection = 1;  // 1 = down, -1 = up
  let previousFrame = 1;
  
  function evictLRUFrames() {
    if (Object.keys(preloadedImages).length > MAX_CACHE_FRAMES) {
      // Find and remove least recently used frame
      let lruFrame = null;
      let lruTime = Infinity;
      
      for (let frameNum in lastAccessOrder) {
        if (lastAccessOrder[frameNum] < lruTime) {
          lruTime = lastAccessOrder[frameNum];
          lruFrame = frameNum;
        }
      }
      
      if (lruFrame !== null) {
        delete preloadedImages[lruFrame];
        delete lastAccessOrder[lruFrame];
      }
    }
  }

  function preloadFrame(frameNumber) {
    if (frameNumber < 1 || frameNumber > 202) return;
    if (!preloadedImages[frameNumber]) {
      evictLRUFrames();
      const numStr = String(frameNumber).padStart(3, '0');
      const img = new Image();
      // PERF: Use WebP format (30-60% smaller than JPEG)
      img.src = 'assets/images/champagne/frame_' + numStr + '.webp';
      img.onerror = () => {
        // Log load error for debugging
        console.warn('Failed to load champagne frame', frameNumber);
      };
      // Asynchronous background decoding: decompress on parallel worker threads
      if (img.decode) {
        img.decode().catch(() => {
          // Silently catch aborts on fast scroll direction changes
        });
      }
      preloadedImages[frameNumber] = img;
    }
    // Update access time for LRU tracking
    lastAccessOrder[frameNumber] = ++accessCounter;
  }

  function handlePreloading(currentFrame) {
    // Detect scroll direction for predictive preloading priority
    if (currentFrame > previousFrame) {
      lastScrollDirection = 1;  // Scrolling down
    } else if (currentFrame < previousFrame) {
      lastScrollDirection = -1; // Scrolling up
    }
    previousFrame = currentFrame;

    // Tier 1: Current frame (critical)
    preloadFrame(currentFrame);
    
    // Tier 2: Next 10 frames in scroll direction (high priority)
    for (let i = 1; i <= 10; i++) {
      preloadFrame(currentFrame + (i * lastScrollDirection));
    }
    
    // Tier 3: Previous 5 frames for backward scroll (medium priority)
    for (let i = 1; i <= 5; i++) {
      preloadFrame(currentFrame - (i * lastScrollDirection));
    }

    // Tier 4: Schedule batch preload of remaining frames in background
    if (!batchPreloadScheduled) {
      batchPreloadScheduled = true;
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          batchPreloadInBackground(currentFrame);
          batchPreloadScheduled = false;
        }, { timeout: 2000 });
      }
    }
  }

  function batchPreloadInBackground(currentFrame) {
    // Batch load frames in chunks to avoid blocking the render loop
    // Prioritize frames closer to current position
    const preloadQueue = [];
    
    // Add all frames in priority order (current is already loaded)
    for (let f = 1; f <= 202; f++) {
      if (!preloadedImages[f]) {
        const distance = Math.abs(f - currentFrame);
        preloadQueue.push({ frame: f, priority: distance });
      }
    }
    
    // Sort by distance (closer frames first)
    preloadQueue.sort((a, b) => a.priority - b.priority);
    
    // Load frames in batches with setTimeout to avoid blocking
    let batchIndex = 0;
    const BATCH_SIZE = 8;
    
    function loadBatch() {
      const endIndex = Math.min(batchIndex + BATCH_SIZE, preloadQueue.length);
      for (let i = batchIndex; i < endIndex; i++) {
        preloadFrame(preloadQueue[i].frame);
      }
      batchIndex = endIndex;
      
      if (batchIndex < preloadQueue.length) {
        setTimeout(loadBatch, 50); // Throttle: 50ms between batches
      }
    }
    
    loadBatch();
  }

  // PERF: Defer initial batch preload until after Scene 1 completes (avoid startup lag)
  // Aggressive pre-warming: start with frames 1-80, then defer 51-202 to idle time
  setTimeout(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        // Immediate warm: frames 1-80 (covers Scene 2 & early Scene 3)
        for (let i = 1; i <= 80; i += 5) {
          preloadFrame(i);
        }
        
        // Deferred warm: frames 51-202 (rest of champagne sequence)
        // Use another idle callback to avoid blocking user interaction
        requestIdleCallback(() => {
          for (let i = 51; i <= 202; i += 8) {
            preloadFrame(i);
          }
        }, { timeout: 5000 });
      }, { timeout: 3000 });
    }
  }, 2000);

  // ─── PERFORMANCE: Frame preload tracking ───
  let lastPreloadedFrame = 0;
  let currentFrame = 1;

  // ─── PERFORMANCE: Style cache tracking (prevent redundant DOM writes) ───
  let lastScene2Opacity = -1;
  let lastScene2Scale = -1;
  let lastScene2Display = '';
  let lastScene2PointerEvents = '';
  let lastScene3Opacity = -1;
  let lastScene3PointerEvents = '';
  let lastScene4Opacity = -1;
  let lastScene4PointerEvents = '';
  let lastScene4BackgroundColor = '';
  let lastScene4ZIndex = '';
  let lastScene5Display = '';
  let lastScene5Opacity = -1;
  let lastScene5PointerEvents = '';
  let lastScene5ZIndex = '';
  let lastScene6Display = '';
  let lastScene6Opacity = -1;
  let lastScene6PointerEvents = '';
  let lastScene6ZIndex = '';
  let lastScene6GlassOpacity = -1;

  // ─── BUTTERFLY IMAGE SEQUENCE (REMOVED - butterfly model only) ───

  // Canvas particle engine removed in favor of high-fashion crisp vector plain text reveal.



  // Caustic videos will be managed by Scene 2 logic
  
  // Initial assets prepped and cached successfully

  // 1. Detect device orientation/viewport conditions (using valid CSS comma for OR)
  const isMobile = window.matchMedia('(orientation: portrait), (max-width: 767px)').matches;
  const targetVideo = 'assets/video/intro-desktop.mp4'; // Use desktop video for all orientations

  // 2. Bind only the correct video to prevent double downloads
  video.src = targetVideo;
  video.load();

  // 3. Play Interaction (Tap anywhere on the video wrapper to play)
  let interactionTriggered = false;

  function playCinematic() {
    if (interactionTriggered) return;
    interactionTriggered = true;

    // ─── AUDIO: Start background music on user interaction ───
    // This must be called directly within the user gesture for iOS compliance
    if (typeof AudioManager !== 'undefined') {
      AudioManager.init();
      AudioManager.resume();
      AudioManager.playBackgroundMusic();
    }

    // Instantly disable interaction pointer events to prevent double taps
    wrapper.style.pointerEvents = 'none';

    // Start the ambient lighting upward pan transition
    ambientLight.classList.add('playing');

    // Programmatically play & pause both caustic videos during this user gesture to "bless" them for mobile/desktop browsers!
    if (causticA) {
      causticA.muted = true;
      causticA.play().then(() => {
        causticA.pause();
        causticA.currentTime = 0;
      }).catch(err => console.warn("Caustic A blessing failed:", err));
    }
    if (causticB) {
      causticB.muted = true;
      causticB.play().then(() => {
        causticB.pause();
        causticB.currentTime = 0;
      }).catch(err => console.warn("Caustic B blessing failed:", err));
    }

    // Chandelier frame sequence is fully image-driven, no gesture blessing required

    // Ensure video has buffered enough data before playing
    const attemptPlay = (retryCount = 0) => {
      // Check if video has sufficient buffered data
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        const bufferPercent = (bufferedEnd / duration) * 100 || 0;
        
        // If less than 20% buffered, wait a bit and retry
        if (bufferPercent < 20 && retryCount < 3) {
          console.log(`Video buffered: ${bufferPercent.toFixed(1)}%, retrying... (attempt ${retryCount + 1})`);
          setTimeout(() => attemptPlay(retryCount + 1), 300);
          return;
        }
      }

      // Play the video smoothly
      video.play()
        .then(() => {
          // Playback started successfully
          console.log('Video playback started');
        })
        .catch((error) => {
          console.warn('Playback failed or was interrupted:', error);
          // Fallback: restore interaction and lighting on failure
          wrapper.style.pointerEvents = 'auto';
          ambientLight.classList.remove('playing');
          interactionTriggered = false;
          
          // Log for debugging
          console.error('Error details:', {
            readyState: video.readyState,
            networkState: video.networkState,
            buffered: video.buffered.length,
            error: video.error
          });
        });
    };

    attemptPlay();

    // Add stall recovery listener
    if (!window.videoStallHandler) {
      window.videoStallHandler = true;
      video.addEventListener('stalled', () => {
        console.warn('Video stalled, attempting recovery...');
        // Reset and retry
        video.pause();
        video.currentTime = video.currentTime;
        video.play().catch(err => console.warn('Recovery play failed:', err));
      });
    }
  }

  // Bind tap/click interaction to BOTH the video wrapper and the video element directly.
  // This satisfies strict mobile browser (like iOS Safari) user-gesture rules perfectly.
  wrapper.addEventListener('click', playCinematic);
  wrapper.addEventListener('touchstart', playCinematic, { passive: true });
  video.addEventListener('click', playCinematic);
  video.addEventListener('touchstart', playCinematic, { passive: true });

  // 4. Timeupdate Listener for Cinematic Fog Transition at 5.08s
  let transitionTriggered = false;

  // 5. Cinematic Scroll Transition Engine — Scene 2 → Scene 3
  //    Uses lerp interpolation for heavy, physically-suspended camera movement.
  //    Animates ONLY transform + opacity (GPU-composited, 60fps stable).
  let scrollEnabled = false;
  let smoothProgress = 0;   // Lerp-smoothed progress (0→1)
  let lastRenderedFrame = -1; // Track last painted frame number to avoid redundant DOM updates
  let rafId = null;

  // Scene 2 removed

  // Lerp factor — lower = heavier, more cinematic inertia
  const LERP = 0.045;

  function enableScroll() {
    if (scrollEnabled) return;
    scrollEnabled = true;

    // 10.0 viewport heights of scroll room — extended for comfortable Scene 5 reading + Scene 6 finale
    document.body.style.height = (window.innerHeight * 10.0) + 'px';
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    // Activate Scene 3 (starts invisible, positioned below)
    scene3.classList.add('active');
    scene3.removeAttribute('aria-hidden');

    // Start the cinematic render loop
    rafId = requestAnimationFrame(cinematicLoop);
  }

  function cinematicLoop() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Lerp toward raw scroll position — creates heavy, inertial feel
    smoothProgress += (rawProgress - smoothProgress) * LERP;

    // Snap to endpoints to prevent infinite micro-drift
    if (Math.abs(smoothProgress - rawProgress) < 0.0005) {
      smoothProgress = rawProgress;
    }

    applyTransition(smoothProgress);

    // PERF: Frame preloading with guard - only when frame actually changes
    if (currentFrame !== lastPreloadedFrame) {
      handlePreloading(currentFrame);
      lastPreloadedFrame = currentFrame;
    }
    
    rafId = requestAnimationFrame(cinematicLoop);
  }

  function applyTransition(p) {
    // ─── SCENE 2: CAUSTIC ATMOSPHERE & EDITORIAL NAMES ───
    let s2Opacity = 0;
    let s2Scale = 1.0;
    
    // Scene 2 timing:
    // - p = 0.00 to 0.10: Scene 2 is fully visible (holds steady)
    // - p = 0.10 to 0.18: Scene 2 fades out
    // - p = 0.18+: Scene 2 is fully hidden
    if (p < 0.10) {
      s2Opacity = 1.0;
      s2Scale = 1.0;
    } else if (p >= 0.10 && p < 0.18) {
      s2Opacity = 1.0 - (p - 0.10) / 0.08;
      s2Scale = 1.0 - (1.0 - s2Opacity) * 0.05; // scales down slightly as it fades out
    } else {
      s2Opacity = 0;
      s2Scale = 0.95;
    }

    // Apply Scene 2 styling
    // PERF: Only update DOM if values changed
    if (s2Opacity !== lastScene2Opacity) {
      scene2.style.opacity = s2Opacity;
      lastScene2Opacity = s2Opacity;
    }
    if (s2Scale !== lastScene2Scale) {
      scene2.style.transform = 'scale(' + s2Scale + ')';
      lastScene2Scale = s2Scale;
    }
    const s2Display = s2Opacity > 0 ? 'flex' : 'none';
    if (s2Display !== lastScene2Display) {
      scene2.style.display = s2Display;
      lastScene2Display = s2Display;
    }
    if (s2Opacity > 0) {
      const s2PE = 'auto';
      if (s2PE !== lastScene2PointerEvents) {
        scene2.style.pointerEvents = s2PE;
        lastScene2PointerEvents = s2PE;
      }
      scene2.removeAttribute('aria-hidden');
    } else {
      const s2PE = 'none';
      if (s2PE !== lastScene2PointerEvents) {
        scene2.style.pointerEvents = s2PE;
        lastScene2PointerEvents = s2PE;
      }
      scene2.setAttribute('aria-hidden', 'true');
    }
    if ('18' !== lastScene4ZIndex) {  // zIndex is always '18' for scene2
      scene2.style.zIndex = '18';
    }

    // ─── SCENE 3 ENTRY, CHAMPAGNE SEQUENCE ───
    let s3ContainerOpacity = 0;
    let s3ContentOpacity = 0;
    let s3Rise = 80;
    currentFrame = 1;  // Module-scoped for cinematicLoop preload tracking

    let s4Active = false;
    let s4Opacity = 0;

    if (p < 0.18) {
      // Scene 3 pre-loads and stays hidden
      s3ContainerOpacity = 0;
      s3ContentOpacity = 0;
      s3Rise = 80;
      currentFrame = 1;
    } else if (p < 0.25) {
      // Scene 3 fades in (p = 0.18 to 0.25)
      const s3FadeIn = (p - 0.18) / 0.07;
      s3ContainerOpacity = s3FadeIn;
      s3ContentOpacity = s3FadeIn;
      s3Rise = 80 - (s3FadeIn * 80);
      currentFrame = 1;
    } else if (p < 0.38) {
      // Scene 3 fully active (p = 0.25 to 0.38) — champagne pours from frame 1 to 202
      s3ContainerOpacity = 1.0;
      s3ContentOpacity = 1.0;
      s3Rise = 0;
      const scene3Progress = (p - 0.25) / 0.13;
      currentFrame = Math.min(Math.max(Math.floor(scene3Progress * 201) + 1, 1), 202);
    } else if (p < 0.42) {
      // Scene 3 fades out (p = 0.38 to 0.42)
      const fadeOut = (p - 0.38) / 0.04;
      s3ContentOpacity = Math.max(0, 1.0 - fadeOut);
      s3ContainerOpacity = Math.max(0, 1.0 - fadeOut);
      s3Rise = -80 * fadeOut;
      currentFrame = 202;
    } else {
      // Scene 3 fully exited (p >= 0.42), Scene 4 takes over
      s4Active = true;
      s4Opacity = 1.0;
      s3ContainerOpacity = 0;
      s3ContentOpacity = 0;
      s3Rise = -80;
      currentFrame = 202;
    }

    // PERF: Only update DOM if values changed
    if (s3ContainerOpacity !== lastScene3Opacity) {
      scene3.style.opacity = s3ContainerOpacity;
      lastScene3Opacity = s3ContainerOpacity;
    }
    // Apply Scene 3 rise/fall transform (upward parallax effect)
    if (s3Content) {
      s3Content.style.transform = 'translateY(' + s3Rise + 'px)';
    }

    // Hide Scene 3 completely when Scene 4 takes over (p >= 0.42)
    if (p >= 0.42) {
      const s3PE = 'none';
      if (s3PE !== lastScene3PointerEvents) {
        scene3.style.pointerEvents = s3PE;
        lastScene3PointerEvents = s3PE;
      }
      scene3.setAttribute('aria-hidden', 'true');
    } else {
      const s3PE = 'auto';
      if (s3PE !== lastScene3PointerEvents) {
        scene3.style.pointerEvents = s3PE;
        lastScene3PointerEvents = s3PE;
      }
      scene3.removeAttribute('aria-hidden');
    }

    // Apply staggered content opacities
    if (s3Content) s3Content.style.opacity = s3ContentOpacity;
    if (s3ChampagneSeq) s3ChampagneSeq.style.opacity = s3ContentOpacity;

    // ─── SCENE 4, 5, 6 OPACITIES & ACTIVE STATES ───
    s4Active = false;
    s4Opacity = 0;
    let s5Active = false;
    let s5Opacity = 0;
    let s6Active = false;
    let s6Opacity = 0;

    if (p >= 0.42 && p < 0.70) {
      s4Active = true;
      s4Opacity = 1.0;
    } else if (p >= 0.70 && p < 0.80) {
      s4Active = false;
      s4Opacity = 0.0;
      s5Active = true;
      s5Opacity = (p - 0.70) / 0.10;
    } else if (p >= 0.80 && p < 0.90) {
      s4Active = false;
      s4Opacity = 0.0;
      s5Active = true;
      // Scene 5 extended full view with scroll responsiveness
      s5Opacity = 1.0;
      s6Active = false;
      s6Opacity = 0.0;
    } else if (p >= 0.90 && p < 1.00) {
      s4Active = false;
      s4Opacity = 0.0;
      s5Active = true;
      // Scene 5 FADES OUT while Scene 6 fades IN (smooth crossfade)
      s5Opacity = Math.max(0, 1.0 - ((p - 0.90) / 0.10));
      s6Active = true;
      s6Opacity = Math.min((p - 0.90) / 0.10, 1.0);
    } else if (p >= 1.00) {
      s4Active = false;
      s4Opacity = 0.0;
      s5Active = false;
      s5Opacity = 0.0;
      s6Active = true;
      s6Opacity = 1.0;
    }

    // Update Scene 4 state dynamically
    if (scene4) {
      if (s4Active) {
        scene4.classList.add('active');
        scene4.removeAttribute('aria-hidden');
        if ('28' !== lastScene4ZIndex) {
          scene4.style.zIndex = '28';
          lastScene4ZIndex = '28';
        }
        const s4PE = s4Opacity > 0.3 ? 'auto' : 'none';
        if (s4PE !== lastScene4PointerEvents) {
          scene4.style.pointerEvents = s4PE;
          lastScene4PointerEvents = s4PE;
        }
        // Show butterfly button during Scene 4
        if (butterflyInteractBtn) {
          butterflyInteractBtn.classList.add('visible');
        }
      } else {
        scene4.classList.remove('active');
        scene4.setAttribute('aria-hidden', 'true');
        const s4PE = 'none';
        if (s4PE !== lastScene4PointerEvents) {
          scene4.style.pointerEvents = s4PE;
          lastScene4PointerEvents = s4PE;
        }
        // Hide butterfly button when leaving Scene 4
        if (butterflyInteractBtn) {
          butterflyInteractBtn.classList.remove('visible');
        }
      }
      const s4OpStr = s4Opacity.toString();
      if (s4OpStr !== lastScene4Opacity) {
        scene4.style.opacity = s4OpStr;
        lastScene4Opacity = s4OpStr;
      }
    }

    // ─── SCENE 4 TIMELINE CARD SCROLL SYNCHRONIZATION ───
    if (s4Active) {
      // Local progress within Scene 4's scroll region (p = 0.42 to p = 0.70)
      const p4 = p < 0.42 ? 0 : Math.min(Math.max((p - 0.42) / 0.28, 0), 1);
      if (scene5) {
        scene5.style.transition = 'none';
        const card = scene5.querySelector('.s5-editorial-card');
        if (card) card.style.transition = 'none';
      }

      // ── 1. PORTAL CINEMATIC ZOOM & PASS-THROUGH (0.00 -> 1.00) ──
      // The camera zooms forward through the arch frame and headline text, making them expand past viewport limits and fade out.
      const archScale = 1.0 + Math.pow(p4, 2.5) * 7.0; // Massively zooms from 1.00 up to 8.00 (pass through camera)
      const archOpacity = p4 < 0.20 ? 1.0 : Math.max(0, 1.0 - (p4 - 0.20) / 0.40); // Fades completely by p4 = 0.60

      const headingScale = 1.0 + Math.pow(p4, 2.2) * 4.0; // Massively zooms from 1.00 up to 5.00
      const headingOpacity = p4 < 0.15 ? 1.0 : Math.max(0, 1.0 - (p4 - 0.15) / 0.40); // Fades completely by p4 = 0.55

      // Pass the local scroll progress to the arch wrapper to communicate with butterfly.js
      if (s4ArchWrapper) {
        s4ArchWrapper.setAttribute('data-scroll-p4', p4.toString());
      }

      // Apply Arch Image Transform
      if (s4ArchImg) {
        s4ArchImg.style.transform = 'scale(' + archScale + ')';
        s4ArchImg.style.opacity = archOpacity.toString();
      }

      // Apply Heading Wrapper Transform (LOCKED to absolute center but scales past camera)
      if (s4HeadingWrapper) {
        s4HeadingWrapper.style.transform = 'translate(-50%, -50%) scale(' + headingScale + ')';
        s4HeadingWrapper.style.opacity = headingOpacity.toString();
        // Dynamically toggle pointer-events so it is clickable only when visible
        s4HeadingWrapper.style.pointerEvents = headingOpacity > 0.05 ? 'auto' : 'none';
      }

      // Keep Arch Wrapper container stable in the center of the viewport (do not scale the entire stage)
      if (s4ArchWrapper) {
        s4ArchWrapper.style.transform = 'translateX(-50%) scale(1)';
        s4ArchWrapper.style.opacity = '1';
      }

      // Force vector text opacity in JS to override any cached CSS opacity:0 rules
      if (s4MainHeading) {
        s4MainHeading.style.opacity = '1';
      }

      // Apply Butterflies Layer (nested 2D atmosphere sequence)
      // Keep butterfly visible throughout entire Scene 4 - do not fade with arch
      const bfOpacity = 1.0;
      if (s4ButterfliesLayer) {
        s4ButterfliesLayer.style.opacity = bfOpacity.toString();
        s4ButterfliesLayer.style.transform = 'translate(-50%, -50%) scale(1)';
      }

      // ── Butterflies 3D Model (butterfly.js handles all animation) ──

      // ── 2. TIMELINE CARDS ZOOM & REVEAL (0.00 -> 0.60) ──
      // The cards zoom forward from the background and fade in, settling into a perfectly centered vertical stack.
      // Clamped at 60% depth so the cards are fully visible sooner and ready for glowing.
      const cardsProgress = Math.min(p4 / 0.60, 1.0);
      const cardScaleFactor = 0.65 + cardsProgress * 0.35; // Zooms up from 0.65 to 1.00
      const cardOpacityFactor = cardsProgress; // Fades in up to 1.00

      // Apply Timeline layout wrapper opacity and fadeout after card glow ends
      if (s4TimelineLayout) {
        // Keep timeline fully visible in butterfly interaction mode, otherwise use scroll progress
        const timelineOpacity = isBoxesLitMode ? 1.0 : (cardOpacityFactor * s4Opacity);
        s4TimelineLayout.style.opacity = timelineOpacity.toString();
      }

      // Progressive individual card reveals over cardsProgress
      const c1Progress = Math.min(Math.max(cardsProgress / 0.50, 0), 1);
      const c2Progress = Math.min(Math.max((cardsProgress - 0.25) / 0.50, 0), 1);
      const c3Progress = Math.min(Math.max((cardsProgress - 0.50) / 0.50, 0), 1);

      const s4Content1 = s4Card1 ? s4Card1.querySelector('.s4-card-content') : null;
      const s4Content2 = s4Card2 ? s4Card2.querySelector('.s4-card-content') : null;
      const s4Content3 = s4Card3 ? s4Card3.querySelector('.s4-card-content') : null;

      // Card 1 (Wedding) — perfectly centered (no horizontal parting)
      if (s4Content1) {
        // Keep cards fully visible and at final scale in butterfly interaction mode
        if (isBoxesLitMode) {
          s4Content1.style.opacity = '1';
          const scaleVal = (0.80 + 1.0 * 0.20) * 1.0; // Final scale of 1.0
          s4Content1.style.transform = 'translate(0px, 0px) scale(' + scaleVal + ')';
        } else {
          s4Content1.style.opacity = (c1Progress * cardOpacityFactor).toString();
          const scaleVal = (0.80 + c1Progress * 0.20) * cardScaleFactor;
          const driftVal = (1.0 - c1Progress) * 35; // Elegant vertical glide up
          s4Content1.style.transform = 'translate(0px, ' + driftVal + 'px) scale(' + scaleVal + ')';
        }
      }
      // Card 2 (Reception) — perfectly centered (no horizontal parting)
      if (s4Content2) {
        if (isBoxesLitMode) {
          s4Content2.style.opacity = '1';
          const scaleVal = (0.80 + 1.0 * 0.20) * 1.0;
          s4Content2.style.transform = 'translate(0px, 0px) scale(' + scaleVal + ')';
        } else {
          s4Content2.style.opacity = (c2Progress * cardOpacityFactor).toString();
          const scaleVal = (0.80 + c2Progress * 0.20) * cardScaleFactor;
          const driftVal = (1.0 - c2Progress) * 35;
          s4Content2.style.transform = 'translate(0px, ' + driftVal + 'px) scale(' + scaleVal + ')';
        }
      }
      // Card 3 (Lunch) — perfectly centered (no horizontal parting)
      if (s4Content3) {
        if (isBoxesLitMode) {
          s4Content3.style.opacity = '1';
          const scaleVal = (0.80 + 1.0 * 0.20) * 1.0;
          s4Content3.style.transform = 'translate(0px, 0px) scale(' + scaleVal + ')';
        } else {
          s4Content3.style.opacity = (c3Progress * cardOpacityFactor).toString();
          const scaleVal = (0.80 + c3Progress * 0.20) * cardScaleFactor;
          const driftVal = (1.0 - c3Progress) * 35;
          s4Content3.style.transform = 'translate(0px, ' + driftVal + 'px) scale(' + scaleVal + ')';
        }
      }

      // Sequential active focus glow toggling — delayed thresholds to ensure proper reading time
      if (s4Card1) s4Card1.classList.toggle('active', p4 >= 0.60);
      if (s4Card2) s4Card2.classList.toggle('active', p4 >= 0.75);
      if (s4Card3) s4Card3.classList.toggle('active', p4 >= 0.90);

    } else {
      // Scene 4 is not active — reset all state
      if (s4Card1) s4Card1.classList.remove('active');
      if (s4Card2) s4Card2.classList.remove('active');
      if (s4Card3) s4Card3.classList.remove('active');
      
      const s4Content1 = s4Card1 ? s4Card1.querySelector('.s4-card-content') : null;
      const s4Content2 = s4Card2 ? s4Card2.querySelector('.s4-card-content') : null;
      const s4Content3 = s4Card3 ? s4Card3.querySelector('.s4-card-content') : null;
      
      if (s4Content1) s4Content1.style.opacity = '0';
      if (s4Content2) s4Content2.style.opacity = '0';
      if (s4Content3) s4Content3.style.opacity = '0';

      if (s4ArchWrapper) {
        s4ArchWrapper.style.transform = 'translateX(-50%) scale(1)';
        s4ArchWrapper.style.opacity = '0';
      }
      // Keep butterfly visible during full Scene 4 duration (p = 0.42 to 0.85)
      if (p >= 0.42 && p < 0.85) {
        if (s4ButterfliesLayer) {
          s4ButterfliesLayer.style.opacity = '1.0';
          s4ButterfliesLayer.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      } else {
        if (s4ButterfliesLayer) {
          s4ButterfliesLayer.style.opacity = '0';
        }
      }
      if (s4HeadingWrapper) {
        s4HeadingWrapper.style.transform = 'translate(-50%, -50%) scale(1)';
        s4HeadingWrapper.style.opacity = '1';
      }
      if (s4MainHeading) {
        s4MainHeading.style.transform = '';
        s4MainHeading.style.opacity = '1';
      }
      if (s4TimelineLayout) {
        s4TimelineLayout.style.transform = '';
        // Only hide timeline if NOT in butterfly interaction mode
        if (!isBoxesLitMode) {
          s4TimelineLayout.style.opacity = '0';
        }
      }

      if (scene4) {
        const s4BgColor = '#DCCAC2';
        if (s4BgColor !== lastScene4BackgroundColor) {
          scene4.style.backgroundColor = s4BgColor;
          lastScene4BackgroundColor = s4BgColor;
        }
      }
    }

    // ─── SCENE 5 & SCENE 6 RENDER STATE ───
    if (scene5) {
      if (s5Active) {
        scene5.classList.add('active');
        scene5.setAttribute('aria-hidden', 'true');
        const s5Display = 'flex';
        if (s5Display !== lastScene5Display) {
          scene5.style.display = s5Display;
          lastScene5Display = s5Display;
        }
        const s5OpStr = s5Opacity.toString();
        if (s5OpStr !== lastScene5Opacity) {
          scene5.style.opacity = s5OpStr;
          lastScene5Opacity = s5OpStr;
        }
        const s5PE = s6Active || s5Opacity <= 0.3 ? 'none' : 'auto';
        if (s5PE !== lastScene5PointerEvents) {
          scene5.style.pointerEvents = s5PE;
          lastScene5PointerEvents = s5PE;
        }
        // Z-index range: 35-40 based on opacity
        const s5ZIdx = (35 + Math.floor(s5Opacity * 5)).toString();
        if (s5ZIdx !== lastScene5ZIndex) {
          scene5.style.zIndex = s5ZIdx;
          lastScene5ZIndex = s5ZIdx;
        }
        scene5.style.transition = 'none';
      } else {
        scene5.classList.remove('active');
        scene5.setAttribute('aria-hidden', 'true');
        const s5Display = 'none';
        if (s5Display !== lastScene5Display) {
          scene5.style.display = s5Display;
          lastScene5Display = s5Display;
        }
        const s5OpStr = '0';
        if (s5OpStr !== lastScene5Opacity) {
          scene5.style.opacity = s5OpStr;
          lastScene5Opacity = s5OpStr;
        }
        const s5PE = 'none';
        if (s5PE !== lastScene5PointerEvents) {
          scene5.style.pointerEvents = s5PE;
          lastScene5PointerEvents = s5PE;
        }
      }
    }

    if (scene6) {
      if (s6Active) {
        scene6.classList.add('active');
        scene6.setAttribute('aria-hidden', 'true');
        const s6Display = 'flex';
        if (s6Display !== lastScene6Display) {
          scene6.style.display = s6Display;
          lastScene6Display = s6Display;
        }
        const s6OpStr = s6Opacity.toString();
        if (s6OpStr !== lastScene6Opacity) {
          scene6.style.opacity = s6OpStr;
          lastScene6Opacity = s6OpStr;
        }
        const s6PE = s6Opacity > 0.3 ? 'auto' : 'none';
        if (s6PE !== lastScene6PointerEvents) {
          scene6.style.pointerEvents = s6PE;
          lastScene6PointerEvents = s6PE;
        }
        // Z-index range: 40-45 based on opacity
        const s6ZIdx = (40 + Math.floor(s6Opacity * 5)).toString();
        if (s6ZIdx !== lastScene6ZIndex) {
          scene6.style.zIndex = s6ZIdx;
          lastScene6ZIndex = s6ZIdx;
        }
        scene6.style.transition = 'none';
        if (s6GlassOverlay) {
          const s6GlassOp = s6Opacity.toString();
          if (s6GlassOp !== lastScene6GlassOpacity) {
            s6GlassOverlay.style.opacity = s6GlassOp;
            lastScene6GlassOpacity = s6GlassOp;
          }
        }
      } else {
        scene6.classList.remove('active');
        scene6.setAttribute('aria-hidden', 'true');
        const s6Display = 'none';
        if (s6Display !== lastScene6Display) {
          scene6.style.display = s6Display;
          lastScene6Display = s6Display;
        }
        const s6OpStr = '0';
        if (s6OpStr !== lastScene6Opacity) {
          scene6.style.opacity = s6OpStr;
          lastScene6Opacity = s6OpStr;
        }
        const s6PE = 'none';
        if (s6PE !== lastScene6PointerEvents) {
          scene6.style.pointerEvents = s6PE;
          lastScene6PointerEvents = s6PE;
        }
        if (s6GlassOverlay) {
          const s6GlassOp = '0';
          if (s6GlassOp !== lastScene6GlassOpacity) {
            s6GlassOverlay.style.opacity = s6GlassOp;
            lastScene6GlassOpacity = s6GlassOp;
          }
        }
      }
    }

    // Apply the active frame image sequence update ONLY if the frame number actually shifted
    if (s3ChampagneImg && currentFrame !== lastRenderedFrame) {
      lastRenderedFrame = currentFrame;
      
      // PERF: Use WebP format (30-60% smaller than JPEG)
      const numStr = String(currentFrame).padStart(3, '0');
      s3ChampagneImg.src = 'assets/images/champagne/frame_' + numStr + '.webp';
      // Log error if image fails to load for debugging
      s3ChampagneImg.onerror = () => {
        console.warn('Failed to load champagne frame', currentFrame);
      };

      // Dynamically align the container background color to the active image frame's own background!
      // This completely dissolves the rectangular image border across the entire scroll progression.
      let activeBgColor = '#FAF1EA'; // Default/Final color (frames 117-202)
      if (currentFrame <= 70) {
        activeBgColor = '#F9F1E6';   // Starting color (frames 1-70)
      } else if (currentFrame <= 116) {
        activeBgColor = '#FAF2E7';   // Transition color (frames 71-116)
      }
      scene3.style.backgroundColor = activeBgColor;

      // PERF: Preloading moved to cinematicLoop to avoid nesting inside render function
    }

    
  }

  function triggerFogTransition() {
    if (transitionTriggered) return;
    transitionTriggered = true;

    // A. Activate the warm ivory fog cloud (fades to solid ivory over 1.2s)
    fog.classList.add('active');
    fog.removeAttribute('aria-hidden');

    // B. Once the viewport is fully covered in solid ivory fog (1.2s)
    setTimeout(() => {
      // Pause video playback and remove the video container from the DOM
      video.pause();
      container.style.display = 'none';

      // Show Scene 2
      if (scene2) {
        scene2.classList.add('active');
        scene2.style.opacity = '1';
        scene2.style.zIndex = '18';
        scene2.style.pointerEvents = 'auto';
        scene2.style.display = 'flex';
        scene2.removeAttribute('aria-hidden');
      }

      // C. Let the visual rest briefly, then softly dissolve the fog cloud away (1.5s)
      setTimeout(() => {
        fog.classList.remove('active');
        fog.setAttribute('aria-hidden', 'true');

        // D. Caustic Atmosphere Delayed Emergence (Dual-video Seamless Crossfade Loop)
        // Allow editorial stillness to settle first, then slowly reveal
        // environmental cinematic light beneath the composition
        setTimeout(() => {
          if (causticWrapper && causticA && causticB) {
            causticWrapper.classList.add('emerged');
            
            const crossfadeDuration = 2.5; // 2.5 seconds crossfade
            let activeVideo = causticA;
            let nextVideo = causticB;
            let checkInterval = null;

            // Ensure both videos are set to loop: false and are programmatically muted to satisfy modern autoplay permissions
            causticA.loop = false;
            causticB.loop = false;
            causticA.muted = true;
            causticB.muted = true;

            // Dynamically bind caustic video sources (deferred from page load to reduce initial resource contention)
            if (!causticA.src) {
              causticA.src = 'assets/video/caustic.mp4';
              causticA.load();
            }
            if (!causticB.src) {
              causticB.src = 'assets/video/caustic.mp4';
              causticB.load();
            }

            function playActive() {
              activeVideo.classList.add('active');
              nextVideo.classList.remove('active');
              
              activeVideo.play()
                .then(() => {
                  startChecking();
                })
                .catch(err => console.warn("Caustic play failed:", err));
            }

            function startChecking() {
              if (checkInterval) clearInterval(checkInterval);
              
              checkInterval = setInterval(() => {
                const duration = activeVideo.duration;
                const currentTime = activeVideo.currentTime;

                if (duration && duration > 0) {
                  // Trigger crossfade 2.5 seconds before the video ends
                  if (duration - currentTime <= crossfadeDuration) {
                    clearInterval(checkInterval);
                    triggerCrossfade();
                  }
                }
              }, 250); // Check 4 times a second
            }

            function triggerCrossfade() {
              nextVideo.currentTime = 0;
              nextVideo.play()
                .then(() => {
                  nextVideo.classList.add('active');
                  activeVideo.classList.remove('active');

                  const prevVideo = activeVideo;
                  setTimeout(() => {
                    prevVideo.pause();
                    prevVideo.currentTime = 0;
                  }, crossfadeDuration * 1000);

                  const temp = activeVideo;
                  activeVideo = nextVideo;
                  nextVideo = temp;

                  startChecking();
                })
                .catch(err => {
                  console.warn("Caustic crossfade play failed, resetting active video:", err);
                  activeVideo.currentTime = 0;
                  startChecking();
                });
            }

            // Start playing the first video
            playActive();
          }

          // E. Enable scroll-based transition to Scene 3 after caustics settle
          setTimeout(() => {
            enableScroll();
          }, 1500);
        }, 3500); // 3.5s after fog dissolves — stillness first, then life
      }, 400); // 400ms organic rest delay
    }, 1200);
  }

  // Track playback time to trigger the cloud transition at exactly 5.08s
  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= 5.08) {
      triggerFogTransition();
    }
  });

  // Safety fallback: if the video ends before 5.08s, trigger the transition immediately
  video.addEventListener('ended', () => {
    triggerFogTransition();
  });

  // 6. Cinematic Presence Response Interaction (Desktop Hover & Mobile Touch Support)
  // Softly triggers environmental light breathing and restrains focus on active interaction.
  // Scene 2 event listeners removed


  // ─── SCENE 3 LIVE COUNTDOWN SYSTEM ───
  // Target Date: 12 July 2026, 10:30 AM
  const TARGET_DATE = new Date('2026-07-12T10:30:00');

  const daysEl = document.getElementById('s3-days');
  const hoursEl = document.getElementById('s3-hours');
  const minsEl = document.getElementById('s3-minutes');
  const secsEl = document.getElementById('s3-seconds');

  function updateCountdown() {
    const now = new Date();
    const difference = TARGET_DATE - now;

    if (difference <= 0) {
      if (daysEl) daysEl.textContent = '000';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Padding values for high-fashion baseline stability
    const daysStr = String(days).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minsStr = String(minutes).padStart(2, '0');
    const secsStr = String(seconds).padStart(2, '0');

    // Only update elements if their textContent actually changed to avoid layout recalculations
    if (daysEl && daysEl.textContent !== daysStr) daysEl.textContent = daysStr;
    if (hoursEl && hoursEl.textContent !== hoursStr) hoursEl.textContent = hoursStr;
    if (minsEl && minsEl.textContent !== minsStr) minsEl.textContent = minsStr;
    if (secsEl && secsEl.textContent !== secsStr) secsEl.textContent = secsStr;
  }

  // Run immediately and then set interval
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ──────────────────────────────────────────────────────────────────────
     SCENE 5 — RSVP FORM & VENUE ACTIONS
     ────────────────────────────────────────────────────────────────────── */

  // Google Form configuration
  const GOOGLE_FORM_ID = '1FAIpQLSeVFE5rUKAERkFIAkI8sI6l3lYj0DPWCY6LkcgXJly1vKvEFg';
  const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeVFE5rUKAERkFIAkI8sI6l3lYj0DPWCY6LkcgXJly1vKvEFg/formResponse';

  // Venue details
  const venueAddress = '24, I.P. Nagar 9th Phase, Banerghatta Road, Golahalli, Bangalore - 560108';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;

  // Scene 5 form elements
  const s5Form = document.getElementById('s5-rsvp-form');
  const s5Modal = document.getElementById('s5-modal');
  const s5DirectionsBtn = document.getElementById('s5-directions-btn');
  const s5CalendarBtn = document.getElementById('s5-calendar-btn');

  // Get Directions Button
  if (s5DirectionsBtn) {
    s5DirectionsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(googleMapsUrl, '_blank');
    });
  }

  // Add to Calendar Button
  if (s5CalendarBtn) {
    s5CalendarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Athul & Melvin Wedding//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:athul-melvin-wedding-20260712@wedding',
        'DTSTAMP:20260601T000000Z',
        'DTSTART;TZID=Asia/Kolkata:20260712T103000',
        'DTEND;TZID=Asia/Kolkata:20260712T150000',
        'SUMMARY:ANANDU&NAVYA\'s BIG DAY',
        'LOCATION:' + venueAddress.replace(/,/g, '\\,'),
        'DESCRIPTION:Cordially invited to celebrate the wedding of Athul Krishnan & Melvin John.\\n\\nCeremony: 10:30 AM – 12:30 PM\\nReception: 1:00 PM onwards\\nLunch: Following Reception',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Anandu & Navya\'s forever!!!\\n' + venueAddress.replace(/,/g, '\\,'),
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Anandu & Navya\'s forever!!!\\n' + venueAddress.replace(/,/g, '\\,'),
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Athul-Melvin-Wedding.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // RSVP Form Submission (to Google Forms)
  if (s5Form) {
    s5Form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('s5-fullname').value;
      const guests = document.getElementById('s5-guests').value;
      const attendance = document.querySelector('input[name="entry.633373139"]:checked').value;

      // Prepare form data
      const formData = new FormData();
      formData.append('entry.1505058638', fullName);
      formData.append('entry.144312370', guests);
      formData.append('entry.633373139', attendance);

      try {
        // Submit to Google Forms using fetch with no-cors mode
        await fetch(GOOGLE_FORMS_URL, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });

        // Show confirmation modal
        const isAttending = attendance === 'Attending';
        const emoji = document.getElementById('s5-modal-emoji');
        const title = document.getElementById('s5-modal-title');
        const msgText = document.getElementById('s5-modal-message');

        emoji.textContent = isAttending ? '🎉' : '💌';
        title.textContent = isAttending ? 'Thank you for showing up!' : 'We would still love that you be there';

        if (isAttending) {
          msgText.textContent = `We're thrilled ${fullName} will be joining us${guests !== '1' ? ` with ${guests}` : ''} guests. Can't wait to celebrate together!`;
        } else {
          msgText.textContent = `We'll miss you, ${fullName}. Your presence would mean the world to us. We hope you can reconsider!`;
        }

        s5Modal.hidden = false;

        // Reset form
        s5Form.reset();

      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your response. Please try again.');
      }
    });

    // Modal close handlers
    if (s5Modal) {
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !s5Modal.hidden) {
          s5Modal.hidden = true;
        }
      });

      // Close on backdrop click
      const backdrop = s5Modal.querySelector('.s5-modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          s5Modal.hidden = true;
        });
      }
    }
  }
});
