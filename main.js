/**
 * Foundational Cinematic Interaction Logic (First Frame Tap Entry & Fog Transition)
 * Renders the first frame of the responsive video dynamically on page load.
 * Tapping anywhere starts smooth playback. At exactly 5.08s of playback, 
 * a dreamlike warm ivory cloud rolls in and dissolves seamlessly into Scene 2.
 * Scrolling after Scene 2 settles transitions into Scene 3.
 */
document.addEventListener('DOMContentLoaded', () => {
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

  // ─── CHAMPAGNE IMAGE SEQUENCE PRELOADER & CACHE ───
  const preloadedImages = {};
  function preloadFrame(frameNumber) {
    if (frameNumber < 1 || frameNumber > 202) return;
    if (!preloadedImages[frameNumber]) {
      const numStr = String(frameNumber).padStart(3, '0');
      const img = new Image();
      img.src = 'assets/images/champagne/frame_' + numStr + '.jpg';
      // Asynchronous background decoding: decompress JPEG on parallel worker threads
      if (img.decode) {
        img.decode().catch(() => {
          // Silently catch aborts on fast scroll direction changes
        });
      }
      preloadedImages[frameNumber] = img;
    }
  }

  function handlePreloading(currentFrame) {
    preloadFrame(currentFrame);
    // Predictive caching: +3 frames ahead and -3 frames behind
    for (let offset = 1; offset <= 3; offset++) {
      preloadFrame(currentFrame + offset);
      preloadFrame(currentFrame - offset);
    }
  }

  // Eagerly cache the first 50 frames immediately on initialization to support longer sequence
  for (let i = 1; i <= 50; i++) {
    preloadFrame(i);
  }

  // ─── BUTTERFLY IMAGE SEQUENCE (REMOVED - butterfly model only) ───

  // Canvas particle engine removed in favor of high-fashion crisp vector plain text reveal.



  // Caustic videos will be managed by Scene 2 logic
  
  // Initial assets prepped and cached successfully

  // 1. Detect device orientation/viewport conditions (using valid CSS comma for OR)
  const isMobile = window.matchMedia('(orientation: portrait), (max-width: 767px)').matches;
  const targetVideo = isMobile ? 'assets/video/intro-mobile.mp4' : 'assets/video/intro-desktop.mp4';

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

    // Play the video smoothly
    video.play()
      .then(() => {
        // Playback started successfully
      })
      .catch((error) => {
        console.warn('Playback failed or was interrupted:', error);
        // Fallback: restore interaction and lighting on failure
        wrapper.style.pointerEvents = 'auto';
        ambientLight.classList.remove('playing');
        interactionTriggered = false;
      });
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
    scene2.style.opacity = s2Opacity;
    scene2.style.transform = 'scale(' + s2Scale + ')';
    scene2.style.display = s2Opacity > 0 ? 'flex' : 'none';
    if (s2Opacity > 0) {
      scene2.style.pointerEvents = 'auto';
      scene2.removeAttribute('aria-hidden');
    } else {
      scene2.style.pointerEvents = 'none';
      scene2.setAttribute('aria-hidden', 'true');
    }
    scene2.style.zIndex = '18';

    // ─── SCENE 3 ENTRY, CHAMPAGNE SEQUENCE ───
    let s3ContainerOpacity = 0;
    let s3ContentOpacity = 0;
    let s3Rise = 80;
    let currentFrame = 1;

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

    scene3.style.opacity = s3ContainerOpacity;
    // Apply Scene 3 rise/fall transform (upward parallax effect)
    if (s3Content) {
      s3Content.style.transform = 'translateY(' + s3Rise + 'px)';
    }

    // Hide Scene 3 completely when Scene 4 takes over (p >= 0.42)
    if (p >= 0.42) {
      scene3.style.pointerEvents = 'none';
      scene3.setAttribute('aria-hidden', 'true');
    } else {
      scene3.style.pointerEvents = 'auto';
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
    } else if (p >= 0.70 && p < 1.00) {
      s4Active = false;
      s4Opacity = 0.0;
      s5Active = true;
      s5Opacity = (p - 0.70) / 0.30;
    } else if (p >= 1.00) {
      s4Active = false;
      s4Opacity = 0.0;
      s5Active = true;
      s5Opacity = 1.0;
      s6Active = true;
      s6Opacity = Math.min((p - 1.00) * 2, 1.0);
    }

    // Update Scene 4 state dynamically
    if (scene4) {
      if (s4Active) {
        scene4.classList.add('active');
        scene4.removeAttribute('aria-hidden');
        scene4.style.zIndex = '28';
        scene4.style.pointerEvents = s4Opacity > 0.3 ? 'auto' : 'none';
      } else {
        scene4.classList.remove('active');
        scene4.setAttribute('aria-hidden', 'true');
        scene4.style.pointerEvents = 'none';
      }
      scene4.style.opacity = s4Opacity.toString();
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
        s4TimelineLayout.style.opacity = (cardOpacityFactor * s4Opacity).toString();
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
        s4Content1.style.opacity = (c1Progress * cardOpacityFactor).toString();
        const scaleVal = (0.80 + c1Progress * 0.20) * cardScaleFactor;
        const driftVal = (1.0 - c1Progress) * 35; // Elegant vertical glide up
        s4Content1.style.transform = 'translate(0px, ' + driftVal + 'px) scale(' + scaleVal + ')';
      }
      // Card 2 (Reception) — perfectly centered (no horizontal parting)
      if (s4Content2) {
        s4Content2.style.opacity = (c2Progress * cardOpacityFactor).toString();
        const scaleVal = (0.80 + c2Progress * 0.20) * cardScaleFactor;
        const driftVal = (1.0 - c2Progress) * 35;
        s4Content2.style.transform = 'translate(0px, ' + driftVal + 'px) scale(' + scaleVal + ')';
      }
      // Card 3 (Lunch) — perfectly centered (no horizontal parting)
      if (s4Content3) {
        s4Content3.style.opacity = (c3Progress * cardOpacityFactor).toString();
        const scaleVal = (0.80 + c3Progress * 0.20) * cardScaleFactor;
        const driftVal = (1.0 - c3Progress) * 35;
        s4Content3.style.transform = 'translate(0px, ' + driftVal + 'px) scale(' + scaleVal + ')';
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
        s4TimelineLayout.style.opacity = '0';
      }

      if (scene4) {
        scene4.style.backgroundColor = '#DCCAC2';
      }
    }

    // ─── SCENE 5 & SCENE 6 RENDER STATE ───
    if (scene5) {
      if (s5Active) {
        scene5.classList.add('active');
        scene5.removeAttribute('aria-hidden');
        scene5.style.display = 'flex';
        scene5.style.opacity = s5Opacity.toString();
        scene5.style.pointerEvents = s5Opacity > 0.3 ? 'auto' : 'none';
        scene5.style.zIndex = '35';
        scene5.style.transition = 'none';
      } else {
        scene5.classList.remove('active');
        scene5.setAttribute('aria-hidden', 'true');
        scene5.style.display = 'none';
        scene5.style.opacity = '0';
        scene5.style.pointerEvents = 'none';
      }
    }

    if (scene6) {
      if (s6Active) {
        scene6.classList.add('active');
        scene6.removeAttribute('aria-hidden');
        scene6.style.display = 'flex';
        scene6.style.opacity = s6Opacity.toString();
        scene6.style.pointerEvents = s6Opacity > 0.3 ? 'auto' : 'none';
        scene6.style.zIndex = '40';
        scene6.style.transition = 'none';
        if (s6GlassOverlay) {
          s6GlassOverlay.style.opacity = s6Opacity.toString();
        }
      } else {
        scene6.classList.remove('active');
        scene6.setAttribute('aria-hidden', 'true');
        scene6.style.display = 'none';
        scene6.style.opacity = '0';
        scene6.style.pointerEvents = 'none';
        if (s6GlassOverlay) {
          s6GlassOverlay.style.opacity = '0';
        }
      }
    }

    // Apply the active frame image sequence update ONLY if the frame number actually shifted
    if (s3ChampagneImg && currentFrame !== lastRenderedFrame) {
      lastRenderedFrame = currentFrame;
      const numStr = String(currentFrame).padStart(3, '0');
      s3ChampagneImg.src = 'assets/images/champagne/frame_' + numStr + '.jpg';

      // Dynamically align the container background color to the active image frame's own background!
      // This completely dissolves the rectangular image border across the entire scroll progression.
      let activeBgColor = '#FAF1EA'; // Default/Final color (frames 117-202)
      if (currentFrame <= 70) {
        activeBgColor = '#F9F1E6';   // Starting color (frames 1-70)
      } else if (currentFrame <= 116) {
        activeBgColor = '#FAF2E7';   // Transition color (frames 71-116)
      }
      scene3.style.backgroundColor = activeBgColor;

      // Handle predictive caching in background threads
      handlePreloading(currentFrame);
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
        'SUMMARY:Athul Krishnan & Melvin John — Wedding',
        'LOCATION:' + venueAddress.replace(/,/g, '\\,'),
        'DESCRIPTION:Cordially invited to celebrate the wedding of Athul Krishnan & Melvin John.\\n\\nCeremony: 10:30 AM – 12:30 PM\\nReception: 1:00 PM onwards\\nLunch: Following Reception',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Athul & Melvin\'s Wedding is tomorrow!',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Athul & Melvin\'s Wedding starts in 2 hours!',
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
