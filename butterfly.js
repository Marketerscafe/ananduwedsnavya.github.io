/**
 * 3D Interactive Butterfly Engine - Figure-8 Cinematic Path Edition
 * Powered by Three.js and skeletal animations
 */
document.addEventListener('DOMContentLoaded', () => {
  const archWrapper = document.getElementById('s4-arch-wrapper');
  if (!archWrapper) {
    console.warn("Arch wrapper '#s4-arch-wrapper' not found. Butterfly engine aborting.");
    return;
  }

  // 1. Create transparent canvas confined strictly within the user-drawn yellow text boundary
  const canvas = document.createElement('canvas');
  canvas.id = 'butterfly-canvas';
  canvas.style.opacity = '0';
  canvas.style.display = 'none';
  archWrapper.insertBefore(canvas, archWrapper.firstChild); // Insert at the bottom of the DOM stack

  // Reference to interactive instruction pop-up
  const instructionEl = document.getElementById('s4-interact-instruction');

  // 2. Three.js Scene Setup
  const scene = new THREE.Scene();

  // Get active client dimensions of the dome canvas box
  let width = canvas.clientWidth || 300;
  let height = canvas.clientHeight || 450;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding; // Preserve original colors
  renderer.physicallyCorrectLights = true;

  // Perspective camera
  const fov = 45;
  const aspect = width / height;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
  const cameraDistance = 12;
  camera.position.set(0, 0, cameraDistance);

  // 3. Coordinate bounds mapping strictly inside the arch canvas viewport
  let visibleWidth, visibleHeight;
  function updateVisibleBounds() {
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    visibleHeight = 2 * Math.tan(vFOV / 2) * cameraDistance;
    visibleWidth = visibleHeight * camera.aspect;
  }
  updateVisibleBounds();

  // 4. Luxury warm environmental lighting system
  // Sky color: warm champagne ivory (0xffeedd), Ground color: soft rose terracotta (0xd8b8ac)
  const hemiLight = new THREE.HemisphereLight(0xffeedd, 0xd8b8ac, 1.8);
  scene.add(hemiLight);

  // Soft low golden directional light representing low sun rays
  const dirLight = new THREE.DirectionalLight(0xfffaed, 1.4);
  dirLight.position.set(6, 10, 4);
  scene.add(dirLight);

  // 5. Variables for Animation and Steering Behavior
  let mixer = null;
  let butterfly = null;
  let innerModel = null;
  const modelCenter = new THREE.Vector3(0, 0, 0);
  let clock = new THREE.Clock();

  // Path Tracking variables
  let pathTime = Math.random() * 100; // Random starting point on the loop
  const pathSpeed = 0.015; // Slow, majestic cinematic speed
  const position = new THREE.Vector3(0, 0, 0);
  const velocity = new THREE.Vector3(0, 0, 0);
  
  // Interactive startle push vector (spring-back system)
  const startleDisplacement = new THREE.Vector3(0, 0, 0);
  let isStartled = false;

  // Mouse coordinate projection (Default to hidden coordinate)
  const mouse3D = new THREE.Vector3(-999, -999, 0);
  
  // Track if user is currently pressing/holding (to pause figure-8 animation in dark mode)
  let isUserPressing = false;

  // 6. Pointer coordinate unprojection relative to canvas bounding client rect & 3D interaction dragging
  let isUserDragging = false;
  let dragStartPointerX = 0;
  let dragStartPointerY = 0;
  let targetUserRotationY = 0;
  let targetUserRotationX = 0;
  let targetUserZoomZ = 0;

  let currentUserRotationY = 0;
  let currentUserRotationX = 0;
  let currentUserZoomZ = 0;
  let interactionWeight = 0;

  function handlePointerMove(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

    const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    mouse3D.copy(camera.position).add(dir.multiplyScalar(t));
  }

  function onPointerDown(clientX, clientY) {
    const s4Container = document.getElementById('scene-4-container');
    const isInDarkMode = s4Container && s4Container.classList.contains('all-boxes-lit');
    if (!isInDarkMode) return;

    isUserDragging = true;
    isUserPressing = true;
    dragStartPointerX = clientX;
    dragStartPointerY = clientY;
  }

  function onPointerMove(clientX, clientY) {
    handlePointerMove(clientX, clientY);

    if (isUserDragging) {
      const deltaX = clientX - dragStartPointerX;
      const deltaY = clientY - dragStartPointerY;

      dragStartPointerX = clientX;
      dragStartPointerY = clientY;

      // Dragging left/right rotates sideways (yaw, around Y axis)
      targetUserRotationY += deltaX * 0.012;

      // Dragging up (negative Y delta) zooms in (positive Z depth)
      // Dragging down (positive Y delta) zooms out (negative Z depth)
      targetUserZoomZ -= deltaY * 0.025;
      targetUserZoomZ = Math.max(-3.0, Math.min(targetUserZoomZ, 7.5));

      // Dragging up/down also tilts pitch slightly
      targetUserRotationX += deltaY * 0.005;
      targetUserRotationX = Math.max(-0.6, Math.min(targetUserRotationX, 0.6));
    }
  }

  function onPointerUp() {
    isUserDragging = false;
    isUserPressing = false;
  }

  window.addEventListener('mousedown', (e) => {
    onPointerDown(e.clientX, e.clientY);
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    onPointerMove(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);
  window.addEventListener('mouseleave', onPointerUp);

  // 7. GLTF Loader
  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/models/butterfly.glb',
    (gltf) => {
      butterfly = new THREE.Group();
      scene.add(butterfly);

      innerModel = gltf.scene;
      
      // Adjust material properties for premium, matte environmental organic look
      innerModel.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.roughness = 0.55; // Prevent harsh plastic/metallic synthetic shine
            child.material.metalness = 0.12; // soft organic sheen
          }
        }
      });

      // Dynamic Bounding Normalizer: Scaled perfectly to 28% of yellow envelope width (Legible, majestic)
      const box = new THREE.Box3().setFromObject(innerModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = visibleWidth * 0.28;
      const normalizedScale = targetSize / maxDim;
      
      innerModel.scale.set(normalizedScale, normalizedScale, normalizedScale);
      
      box.getCenter(modelCenter);
      innerModel.position.copy(modelCenter).multiplyScalar(-1);

      butterfly.add(innerModel);

      // Program skeletal animation clips
      const clips = gltf.animations;
      if (clips && clips.length > 0) {
        mixer = new THREE.AnimationMixer(innerModel);
        const action = mixer.clipAction(clips[0]);
        action.play();
      }

      // Start render loop
      animate();
    },
    undefined,
    (error) => {
      console.error('An error occurred loading the GLB model:', error);
    }
  );

  // Reference to Scene 4 container for state sync
  const scene4El = document.getElementById('scene-4-container');

  // Track render errors for auto-recovery
  let renderErrorCount = 0;
  const MAX_RENDER_ERRORS = 3;

  // Error recovery function
  function resetButterflyScene() {
    console.error('Butterfly render failed, attempting recovery...');
    renderErrorCount += 1;
    
    if (renderErrorCount >= MAX_RENDER_ERRORS) {
      console.error('Butterfly recovery failed after ' + MAX_RENDER_ERRORS + ' attempts. Disabling butterfly rendering.');
      return false;
    }

    try {
      // Clear the scene
      if (butterfly && scene) {
        scene.remove(butterfly);
      }
      
      // Reset WebGL context if possible
      if (renderer && renderer.getContext) {
        const gl = renderer.getContext();
        if (gl && gl.getExtension('WEBGL_lose_context')) {
          gl.getExtension('WEBGL_lose_context').loseContext();
        }
      }

      console.log('Butterfly scene reset attempt ' + renderErrorCount);
      return true;
    } catch (err) {
      console.error('Butterfly reset failed:', err);
      return false;
    }
  }

  // 8. Physics Steering Update & Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // ─── ONLY FOR ARCH SCENE (SCENE 4 STATE ACTIVE SYNC) ───
    if (scene4El) {
      const isActive = scene4El.classList.contains('active');
      const s4Opacity = parseFloat(window.getComputedStyle(scene4El).opacity) || 0;
      
      // Read the scroll progress p4 from s4-arch-wrapper
      const p4 = parseFloat(archWrapper.getAttribute('data-scroll-p4')) || 0;

      // Compute zoom scale and fade out multiplier in perfect lockstep with s4 elements
      let bfScale = Math.max(0.4, 1.0 - Math.pow(p4, 1.5) * 0.6); // Scale shrinks from 1.0 to 0.4 as you scroll
      let bfOpacityMult = p4 < 0.85 ? 1.0 : Math.max(0, 1.0 - (p4 - 0.85) / 0.15); // Stays visible during boxes, fades at end

      // Increase butterfly size and opacity when in all-boxes-lit mode (button clicked)
      const isInDarkMode = scene4El.classList.contains('all-boxes-lit');
      if (isInDarkMode) {
        bfScale = Math.min(2.2, bfScale * 1.8); // Increase size by 80% (cap at 2.2)
        bfOpacityMult = 1.0; // Keep full opacity like the boxes (no fade-out)
        
        // Increase size by additional 30% when user is holding/pressing on butterfly
        if (isUserPressing) {
          bfScale = Math.min(2.86, bfScale * 1.3); // Additional 30% size boost (cap at 2.86)
        }
      }

      // When in interactive dark mode, canvas is fixed full screen, so no -50% translation is needed
      if (isInDarkMode) {
        canvas.style.transform = 'scale(' + bfScale + ')';
      } else {
        canvas.style.transform = 'translate(-50%, -50%) scale(' + bfScale + ')';
      }

      let targetCanvasOpacity = 0;
      if (isActive && s4Opacity > 0.05) {
        targetCanvasOpacity = s4Opacity * bfOpacityMult;
      }
      
      // Smoothly interpolate canvas opacity
      let currentCanvasOpacity = parseFloat(canvas.style.opacity) || 0;
      currentCanvasOpacity += (targetCanvasOpacity - currentCanvasOpacity) * 0.08;
      canvas.style.opacity = currentCanvasOpacity.toString();

      // Pause rendering completely when invisible
      if (currentCanvasOpacity < 0.01) {
        canvas.style.display = 'none';
        return;
      } else {
        canvas.style.display = 'block';
      }
    }

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (butterfly) {
      const dt = Math.min(delta * 60, 2.0);

      // Smoothly interpolate user variables
      const lerpFactor = 0.1 * dt;
      currentUserRotationY += (targetUserRotationY - currentUserRotationY) * lerpFactor;
      currentUserRotationX += (targetUserRotationX - currentUserRotationX) * lerpFactor;
      currentUserZoomZ += (targetUserZoomZ - currentUserZoomZ) * lerpFactor;

      const targetWeight = isUserDragging ? 1.0 : 0.0;
      interactionWeight += (targetWeight - interactionWeight) * (isUserDragging ? 0.1 : 0.06) * dt;

      // Show/hide instruction element during dragging
      if (instructionEl) {
        if (isUserDragging) {
          instructionEl.classList.add('hidden-active');
        } else {
          instructionEl.classList.remove('hidden-active');
        }
      }

      // ─── A. CINEMATIC PATH: Horizontal Figure-8 (Lemniscate of Bernoulli) ───
      // Center width radius (a) and vertical height loops radius (b)
      const a = visibleWidth * 0.38;
      const b = visibleHeight * 0.30;

      // Calculate base path position at current time t
      const cosT = Math.cos(pathTime);
      const sinT = Math.sin(pathTime);
      const denom = 1 + sinT * sinT;

      const baseX = (a * cosT) / denom;
      const baseY = (b * sinT * cosT) / denom;
      const baseZ = Math.sin(pathTime * 2.0) * 0.25; // Gentle horizontal depth ripple

      // ─── B. HIGH-FREQUENCY ORGANIC FLUTTER NOISE (Applied as local visual displacement to inner model) ───
      const flutterX = Math.cos(pathTime * 12.0) * 0.04;
      const flutterY = Math.sin(pathTime * 16.0) * 0.06;
      const flutterZ = Math.sin(pathTime * 14.0) * 0.02;

      if (innerModel) {
        innerModel.position.set(
          -modelCenter.x + flutterX,
          -modelCenter.y + flutterY,
          -modelCenter.z + flutterZ
        );
      }

      // ─── C. STARTLE POINTER INTERACTION & DYNAMIC DISPLACEMENT ───
      const currentPos = new THREE.Vector3(baseX, baseY, baseZ).add(startleDisplacement);
      const pointerDistance = currentPos.distanceTo(mouse3D);
      const startleThreshold = visibleWidth * 0.42;

      if (pointerDistance < startleThreshold && mouse3D.x > -990 && !isUserDragging) {
        isStartled = true;
        // Calculate startling force vector away from the cursor
        const pushDir = currentPos.clone().sub(mouse3D).normalize();
        pushDir.z += (Math.random() - 0.5) * 0.2; // Add vertical/depth recoil
        
        // Dynamic push force relative to cursor distance
        const pushForce = (1.0 - (pointerDistance / startleThreshold)) * 0.28 * dt;
        startleDisplacement.add(pushDir.multiplyScalar(pushForce));
        
        if (mixer) mixer.timeScale = THREE.MathUtils.lerp(mixer.timeScale, 2.6, 0.1); // Frantic wing flap
      } else {
        isStartled = false;
        if (mixer) mixer.timeScale = THREE.MathUtils.lerp(mixer.timeScale, 1.0, 0.04); // Graceful loop flap
      }

      // Spring-back decay: Decays startling displacement vector smoothly back to 0 (Return to track)
      const springRestoration = 0.93; // Return weight coefficient
      startleDisplacement.multiplyScalar(Math.pow(springRestoration, dt));

      // ─── D. POSITION UPDATE (Parent group tracks smooth trajectory only) ───
      const lastPos = position.clone();
      
      // Interpolate path position to center (0, 0, 0) as interactionWeight increases
      position.set(
        baseX * (1.0 - interactionWeight) + startleDisplacement.x,
        baseY * (1.0 - interactionWeight) + startleDisplacement.y,
        baseZ * (1.0 - interactionWeight) + startleDisplacement.z + currentUserZoomZ
      );

      // Hard safety constraints: keeps the butterfly strictly bounded inside the text envelope box
      const boundX = visibleWidth * 0.45;
      const boundY = visibleHeight * 0.43;
      position.x = Math.max(Math.min(position.x, boundX), -boundX);
      position.y = Math.max(Math.min(position.y, boundY), -boundY);
      position.z = Math.max(Math.min(position.z, 8.5), -3.5); // Extended bound range for zoom interaction

      butterfly.position.copy(position);

      // ─── E. SMOOTH DUAL TANGENT VELOCITY ROTATION (Cinematic Slerp) ───
      // Calculate true velocity vector based on current frame displacement of smooth trajectory
      velocity.copy(position).sub(lastPos);

      // 1. Calculate automatic flight rotation
      const autoQuaternion = new THREE.Quaternion();
      if (velocity.lengthSq() > 0.00001) {
        const dir = velocity.clone().normalize();
        const targetPos = position.clone().add(dir);
        
        const tempRotation = butterfly.quaternion.clone();
        butterfly.lookAt(targetPos);
        const targetRotation = butterfly.quaternion.clone();
        
        butterfly.quaternion.copy(tempRotation);
        butterfly.quaternion.slerp(targetRotation, 0.12 * dt); // Buttery smooth slerp dampening
        
        // Aerodynamic banking banking roll based on horizontal turns
        butterfly.rotateOnAxis(new THREE.Vector3(0, 0, 1), -velocity.x * 3.8);
        butterfly.rotateOnAxis(new THREE.Vector3(1, 0, 0), velocity.y * 1.6);
        
        autoQuaternion.copy(butterfly.quaternion);
      } else {
        autoQuaternion.copy(butterfly.quaternion);
      }

      // 2. Blend towards user interaction rotation if interaction is active
      if (interactionWeight > 0.001) {
        const userQuaternion = new THREE.Quaternion();
        const euler = new THREE.Euler(0.4 + currentUserRotationX, currentUserRotationY, 0, 'YXZ');
        userQuaternion.setFromEuler(euler);
        
        butterfly.quaternion.copy(autoQuaternion).slerp(userQuaternion, interactionWeight);
      }

      // Advance path time increment based on active startled flight speed multiplier
      // But pause figure-8 animation when user is pressing/holding in dark mode
      const isInDarkMode = scene4El && scene4El.classList.contains('all-boxes-lit');
      const shouldPauseAnimation = isUserPressing && isInDarkMode;
      
      if (!shouldPauseAnimation) {
        const activeSpeedMultiplier = isStartled ? 2.2 : 1.0;
        pathTime += pathSpeed * dt * activeSpeedMultiplier;
      }

      // Decay user variables towards 0 when not dragging
      if (!isUserDragging) {
        targetUserRotationY += (0 - targetUserRotationY) * 0.08 * dt;
        targetUserRotationX += (0 - targetUserRotationX) * 0.08 * dt;
        targetUserZoomZ += (0 - targetUserZoomZ) * 0.08 * dt;
      }
    }

    try {
      renderer.render(scene, camera);
      renderErrorCount = 0; // Reset error count on successful render
    } catch (err) {
      console.error('Butterfly render error:', err);
      if (!resetButterflyScene()) {
        // If recovery failed, stop rendering
        return;
      }
    }
  }

  // 9. Handle window resizing smoothly
  window.addEventListener('resize', () => {
    width = canvas.clientWidth || 300;
    height = canvas.clientHeight || 450;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateVisibleBounds();
  });
});
