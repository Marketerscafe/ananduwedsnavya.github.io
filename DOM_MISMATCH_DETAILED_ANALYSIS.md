# DOM Mismatch Analysis: Butterfly Button & all-boxes-lit State

**Status**: 🔴 CRITICAL RACE CONDITION IDENTIFIED  
**Date**: June 4, 2026  
**Affected Elements**: Scene 4 container, timeline cards, arch image, butterflies layer

---

## 1. BUTTON CLICK EVENT VERIFICATION ✅

### Event Listener Attachment
- **Element**: `#butterfly-interact-btn`
- **File**: [main.js](main.js#L178)
- **Status**: ✅ Listener IS attached
- **Code**:
```javascript
if (butterflyInteractBtn) {
  butterflyInteractBtn.addEventListener('click', function(e) {
    e.preventDefault();  // ✅ CALLED
    isBoxesLitMode = !isBoxesLitMode;  // Toggle flag
    scene4.classList.toggle('all-boxes-lit');  // ✅ CLASS TOGGLED
    // ... rest of handler
  });
}
```

### Event Bubbling Prevention
- **preventDefault()**: ✅ YES - called at [main.js:184](main.js#L184)
- **Event bubbling**: Not suppressed (but click handler prevents default action)
- **Propagation**: ✅ Handler executes fully

### Verification Checklist
| Check | Status | Details |
|-------|--------|---------|
| Event listener exists | ✅ | Added via addEventListener at DOMContentLoaded |
| preventDefault() called | ✅ | Line 184: `e.preventDefault()` |
| Event fires | ✅ | Should fire on every click |
| Class toggle called | ✅ | Line 187: `scene4.classList.toggle('all-boxes-lit')` |
| Handler completes | ✅ | No early returns or errors visible |

---

## 2. CLASS TOGGLE VERIFICATION ✅ (BUT with issues during scroll)

### Class Toggle Code
**[main.js - lines 184-257](main.js#L184-L257)**

```javascript
butterflyInteractBtn.addEventListener('click', function(e) {
  e.preventDefault();
  isBoxesLitMode = !isBoxesLitMode;

  // Toggle all-boxes-lit state on Scene 4
  if (scene4) {
    scene4.classList.toggle('all-boxes-lit');  // ← CLASS IS TOGGLED HERE
    
    if (scene4.classList.contains('all-boxes-lit')) {
      // ENTERING boxes-lit mode
      underwaterVideo.style.opacity = '1';
      // ... video setup code ...
      
      if (s4Card1) s4Card1.classList.add('active');
      if (s4Card2) s4Card2.classList.add('active');
      if (s4Card3) s4Card3.classList.add('active');
      
      lockScrollAndZoom();
      butterflyInteractBtn.textContent = 'Resume Invite';
      
      const targetScroll = maxScroll * 0.69;  // Target scroll position
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });  // ← SCROLL BEGINS
    } else {
      // EXITING boxes-lit mode
      unlockScrollAndZoom();
      butterflyInteractBtn.textContent = 'Interact with Butterfly';
      // ... rest of code ...
    }
  }
});
```

### DOM Verification After Toggle
✅ **Class IS added** to scene4 when entering mode  
✅ **Class IS removed** when exiting mode  
⚠️ **BUT**: Class presence doesn't guarantee visual effect

**Why?** → See section 3 below (Inline Style Override)

### Potential Issues with Class Persistence
1. **Scroll handler never removes class explicitly** - This is OK, class persists
2. **No code checks if all-boxes-lit was manually removed** - OK, not an issue
3. **Class is toggled BEFORE scroll animation** - This is the problem!

---

## 3. CSS APPLICATION VERIFICATION ❌ (FAILS due to inline styles)

### Expected CSS Rules
**[style.css - lines 596-620](style.css#L596-L620)**

```css
.scene-4-container.all-boxes-lit {
  opacity: 1;
  pointer-events: auto;
  background-color: rgba(10, 8, 5, 0.3);
  z-index: 1000;
}

.scene-4-container.all-boxes-lit #s4-card-1,
.scene-4-container.all-boxes-lit #s4-card-2,
.scene-4-container.all-boxes-lit #s4-card-3 {
  opacity: 1;  /* ← Should be fully visible */
}

.scene-4-container.all-boxes-lit .s4-card-content {
  background: rgba(255, 255, 255, 0.65);
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 40px 80px rgba(200, 150, 100, 0.25), ...;
}
```

### Actual Styles Applied (During Scroll)
**[main.js - lines 932-1050 (applyTransition function)](main.js#L932-L1050)**

The scroll handler sets INLINE STYLES that override CSS class rules:

```javascript
if (s4Active) {
  // When s4Active = true (scroll progress p between 0.42-0.70)
  
  // These INLINE styles are applied:
  if (s4ArchImg) {
    s4ArchImg.style.opacity = archOpacity.toString();  // ← INLINE (wins over CSS)
    s4ArchImg.style.transform = 'scale(...)';
  }
  
  if (s4HeadingWrapper) {
    s4HeadingWrapper.style.opacity = headingOpacity.toString();  // ← INLINE
  }
  
  if (s4TimelineLayout) {
    s4TimelineLayout.style.opacity = (cardOpacityFactor * s4Opacity).toString();  // ← INLINE
  }
} else {
  // When s4Active = false (scroll progress p < 0.42 or p >= 0.70)
  
  if (s4ArchWrapper) {
    s4ArchWrapper.style.opacity = '0';  // ← KILLS VISIBILITY
  }
  
  if (s4TimelineLayout) {
    s4TimelineLayout.style.opacity = '0';  // ← INLINE KILLS TIMELINE
  }
  
  // ... more resets ...
}
```

### CSS Specificity Problem

```
CSS Specificity Chart:
═══════════════════════════════════════════════════════════════

Inline Styles (element.style)  ← HIGHEST PRIORITY (always wins)
  Example: s4TimelineLayout.style.opacity = '0'

.all-boxes-lit .s4-card-content  ← Lower priority (class selectors)
  Example: opacity: 1;

Default element styles  ← Lowest priority
```

**The Problem**: When the scroll handler sets `s4TimelineLayout.style.opacity = '0'`, this INLINE style has higher specificity than the CSS rule `.all-boxes-lit .s4-card-content { opacity: 1; }`.

**Result**: Elements stay hidden even though `.all-boxes-lit` class is present!

### Scroll Event Interference

The scroll handler runs CONSTANTLY (on every RAF frame during scroll):

| Timeline | Event | p Value | s4Active | Inline Style Set | CSS Applied? |
|----------|-------|---------|----------|------------------|--------------|
| T=0ms | Click button | varies | varies | toggle class | Pending scroll |
| T=1ms | Scroll starts | 0.67 | TRUE | s4TimelineLayout.opacity set | ✅ CSS applies (no inline override yet) |
| T=50ms | Mid-scroll | 0.68 | TRUE | s4TimelineLayout.opacity updated | ✅ CSS applies with inline style |
| T=100ms | Scroll completes | 0.69 | TRUE | s4TimelineLayout.opacity = '(value)' | ✅ CSS applies, but... |
| T=150ms | User scrolls further | 0.71 | **FALSE** | **s4TimelineLayout.opacity = '0'** | ❌ Inline style HIDES everything! |

Once `p >= 0.70`, this code executes:
```javascript
if (s4TimelineLayout) {
  s4TimelineLayout.style.opacity = '0';  // ← INLINE STYLE WINS
}
```

Even though `.all-boxes-lit` class still exists on scene4, the inline style `opacity: 0` has higher CSS specificity and hides the content!

---

## 4. RACE CONDITIONS IDENTIFIED

### Race Condition #1: Scroll Animation During Class Toggle ⚠️

**Timing**:
1. Button click toggles `.all-boxes-lit` class at T=0
2. `window.scrollTo()` called with `behavior: 'smooth'` (150-200ms animation)
3. During this smooth scroll, `cinematicLoop()` fires every ~16ms (60fps)
4. Each frame calls `applyTransition(p)` with scroll progress value

**The Issue**:
- Scroll progress `p` changes smoothly from current position to target (p=0.69)
- Scroll handler uses `p` to determine `s4Active` state
- If scroll overshoots or continues past p=0.70, `s4Active` becomes FALSE
- When FALSE, inline style `s4TimelineLayout.style.opacity = '0'` is set
- This OVERRIDES the `.all-boxes-lit` CSS styles

**Code Evidence**:
```javascript
// Button click sets this up
window.scrollTo({
  top: targetScroll,  // maxScroll * 0.69
  behavior: 'smooth'  // ← Takes 150-200ms with easing
});

// WHILE SMOOTH SCROLL IS HAPPENING:
// cinematicLoop runs every 16ms (60fps)
const smoothProgress += (rawProgress - smoothProgress) * LERP;
applyTransition(smoothProgress);

// INSIDE applyTransition:
if (p >= 0.42 && p < 0.70) {
  s4Active = true;  // ✅ Good
} else if (p >= 0.70 || p < 0.42) {
  s4Active = false; // ❌ This triggers opacity = '0'
}
```

### Race Condition #2: Scroll Handler Overwrites Inline Styles ⚠️

**Timing**:
1. Button click at T=0: class added, scroll starts
2. T=16ms: First `applyTransition()` call, sets inline styles based on current `p`
3. T=32ms: Next `applyTransition()` call, OVERWRITES previous inline styles
4. This happens 60 times per second during smooth scroll

**The Issue**:
- Scroll handler CONTINUALLY rewrites inline styles
- These inline styles have higher CSS specificity than `.all-boxes-lit` class
- Once `p > 0.70`, the scroll handler sets `opacity: 0` on timeline layout
- This completely hides the cards, overriding `.all-boxes-lit` CSS

**Example Timeline**:
```
T=0ms:
  Click detected
  scene4.classList.toggle('all-boxes-lit')  ← .all-boxes-lit class added
  window.scrollTo({ top: 0.69 * maxScroll, behavior: 'smooth' })
  
T=16ms (Frame 1):
  p = 0.67 (smoothed scroll progress)
  s4Active = true
  s4TimelineLayout.style.opacity = '0.9'  ← Set by scroll handler
  CSS .all-boxes-lit rule: opacity: 1 (ignored due to inline style)

T=32ms (Frame 2):
  p = 0.675
  s4Active = true
  s4TimelineLayout.style.opacity = '0.95'  ← UPDATED by scroll handler
  CSS .all-boxes-lit rule: opacity: 1 (still ignored)

T=100ms (Frame 6):
  p = 0.69 (target scroll reached)
  s4Active = true
  s4TimelineLayout.style.opacity = '1.0'  ← Good!
  CSS .all-boxes-lit rule: opacity: 1 (matches)
  ✅ ELEMENTS NOW VISIBLE

T=116ms (Frame 7 - USER SCROLLS MANUALLY):
  p = 0.71 (scroll goes past target)
  s4Active = FALSE  ← Condition p >= 0.70 is true
  Scroll handler runs this block:
    if (s4TimelineLayout) {
      s4TimelineLayout.style.opacity = '0';  ← INLINE STYLE SET
    }
  ❌ ELEMENTS HIDDEN (inline style wins over CSS)
```

### Race Condition #3: isBoxesLitMode Flag Never Checked During Scroll ⚠️

**Code Issue**:
```javascript
// Button sets this flag
let isBoxesLitMode = false;

if (butterflyInteractBtn) {
  butterflyInteractBtn.addEventListener('click', function(e) {
    isBoxesLitMode = !isBoxesLitMode;  // ← Flag toggled here
    scene4.classList.toggle('all-boxes-lit');
    // ... scroll happens ...
  });
}

// BUT the scroll handler NEVER checks this flag!
function applyTransition(p) {
  // Uses only 'p' value to determine state, ignores isBoxesLitMode
  if (p >= 0.42 && p < 0.70) {
    s4Active = true;
  } else {
    s4Active = false;
  }
}
```

**The Problem**: 
- Flag `isBoxesLitMode` is toggled but never used by scroll handler
- Scroll handler uses only `p` (scroll progress) to determine visibility
- If user scrolls past p=0.70, scroll handler thinks Scene 4 is "not active"
- Even though `isBoxesLitMode = true` (button was clicked), styles are hidden
- **No synchronization between button state and scroll state**

---

## 5. STATE MANAGEMENT BUGS 🔴

### Bug #1: isBoxesLitMode Flag is Decoupled from Scroll State

**Current Implementation**:
```javascript
let isBoxesLitMode = false;

// Set by button click
butterflyInteractBtn.addEventListener('click', function(e) {
  isBoxesLitMode = !isBoxesLitMode;  // ← Toggled here
  // ... but scroll handler never reads this flag!
});

// Scroll handler ignores the flag
function applyTransition(p) {
  if (p >= 0.42 && p < 0.70) {
    s4Active = true;  // ← Based ONLY on 'p', not isBoxesLitMode
  }
}
```

**Why It's a Bug**:
- Button can set `isBoxesLitMode = true`
- But if scroll progress `p > 0.70`, scroll handler treats Scene 4 as inactive
- Scroll handler doesn't check if user intentionally activated "boxes lit mode"
- Result: Scene 4 gets hidden even though user explicitly clicked the button

### Bug #2: Inline Styles Always Override Class Styles

**Current Implementation**:
```javascript
// Scroll handler sets inline styles
s4TimelineLayout.style.opacity = (cardOpacityFactor * s4Opacity).toString();

// CSS rule exists but is ignored
.all-boxes-lit .s4-card-content {
  opacity: 1;  /* ← Lost to inline style */
}
```

**CSS Specificity (lower wins)**:
- Inline style: `style="opacity: 0"` (specificity = ∞)
- `.all-boxes-lit .s4-card-content` (specificity = 20)
- **Inline ALWAYS wins**

### Bug #3: No Persistent State for all-boxes-lit Mode

**Current Implementation**:
```javascript
// When entering dark mode
if (scene4.classList.contains('all-boxes-lit')) {
  // ... code runs ...
} else {
  // When exiting, code runs to hide things
  // But: Scroll handler can hide things AGAIN if p changes
}
```

**The Problem**:
- Once user exits "boxes lit mode" via button, the class is removed
- But if they scroll back into the p=0.42-0.70 range, Scene 4 becomes visible again
- This is unexpected behavior
- **All-boxes-lit should be a persistent state**, not dependent on scroll position

### Bug #4: No Guard Against Scroll Handler Resets During Smooth Scroll

**Current Implementation**:
```javascript
window.scrollTo({
  top: targetScroll,
  behavior: 'smooth'  // ← 150-200ms animation
});

// During this animation, scroll handler fires 60 times per second
// No guard prevents inline styles from being overwritten
```

**The Problem**:
- Smooth scroll takes 150-200ms
- During this time, scroll handler fires ~10 times
- Each time it can overwrite the inline styles
- No mechanism to prevent this

---

## 6. EXACT SEQUENCE OF EVENTS (MILLISECOND ORDER)

### SCENARIO A: Clicking "Interact with Butterfly" (Enter Dark Mode)

```
T=0ms
  └─ User clicks #butterfly-interact-btn
  └─ Event listener fires
     └─ e.preventDefault() called
     └─ isBoxesLitMode toggled from false to true
     └─ scene4.classList.toggle('all-boxes-lit') ← CLASS ADDED
     └─ underwaterVideo.style.opacity = '1'
     └─ s4Card1.classList.add('active')
     └─ s4Card2.classList.add('active')
     └─ s4Card3.classList.add('active')
     └─ lockScrollAndZoom()
     └─ butterflyInteractBtn.textContent = 'Resume Invite'
     └─ window.scrollTo({ top: maxScroll * 0.69, behavior: 'smooth' })
     │  (Browser: Smooth scroll animation scheduled for ~150-200ms)

T=1ms
  └─ Scroll animation begins (easing function applied)
  └─ window.scrollY changes from current to target over time
  └─ JavaScript scroll event fires (maybe, depends on browser)

T=16ms (Frame 1 of 60fps)
  └─ requestAnimationFrame fires
  └─ cinematicLoop() executes
  │  └─ scrollY = window.scrollY (getting updated scroll position)
  │  └─ rawProgress = scrollY / maxScroll (e.g., 0.67)
  │  └─ smoothProgress += (rawProgress - smoothProgress) * LERP
  │  │  (Smoothed progress with easing)
  │  └─ applyTransition(smoothProgress) called with p ≈ 0.67
  │     └─ s4Active = true (since 0.42 < 0.67 < 0.70)
  │     └─ p4 = (0.67 - 0.42) / 0.28 = 0.89
  │     └─ archScale = 1.0 + 0.89^2.5 * 7.0 ≈ 6.8
  │     └─ s4ArchImg.style.opacity = archOpacity
  │     └─ s4ArchImg.style.transform = 'scale(6.8)'
  │     └─ s4TimelineLayout.style.opacity = (some value)
  │     └─ cardOpacityFactor applied
  │        CSS .all-boxes-lit rule still applies UNDERNEATH

T=32ms (Frame 2)
  └─ requestAnimationFrame fires again
  └─ cinematicLoop() executes again
  └─ p ≈ 0.68 (smoothly approaching 0.69)
  └─ applyTransition called again
     └─ All inline styles UPDATED based on new p value
     └─ CSS .all-boxes-lit still underneath

...frames 3-6 similar...

T=100ms (Frame 6)
  └─ Smooth scroll animation approaching completion
  └─ scrollY ≈ maxScroll * 0.69
  └─ p ≈ 0.69 (target position)
  └─ applyTransition called
     └─ s4Active = true (0.69 is still < 0.70)
     └─ archOpacity ≈ 0.5-0.7
     └─ cardOpacityFactor ≈ 1.0
     └─ s4TimelineLayout.style.opacity = '1.0'
     └─ CSS .all-boxes-lit .s4-card-content now VISIBLE!
        ✅ Cards light up, background darkens, underwater video visible

T=116ms (Frame 7)
  └─ Smooth scroll animation completes
  └─ scrollY = maxScroll * 0.69 (stable)
  └─ User sees dark mode with illuminated cards
  └─ Button text: "Resume Invite"
  └─ Scroll and zoom LOCKED

T=500ms - [User interacts or page continues]
  └─ No automatic actions
  └─ User can interact with buttons/forms in Scene 4
```

### SCENARIO B: Page Continues Scrolling Past 0.70 (RACE CONDITION)

```
T=100ms [Previous scenario ends]
  └─ User is in dark mode (p=0.69)
  └─ .all-boxes-lit class present on scene4
  └─ Cards visible

T=150ms [User scrolls manually OR scroll animation continues]
  └─ Window scrollY changes
  └─ scrollY > maxScroll * 0.70
  └─ rawProgress > 0.70
  └─ p ≈ 0.71

T=166ms (Frame, p=0.71)
  └─ requestAnimationFrame fires
  └─ cinematicLoop() executes
  └─ applyTransition(0.71) called
     └─ p >= 0.70 condition is TRUE
     └─ s4Active = FALSE ❌
     └─ This block executes:
        │
        if (s4ArchWrapper) {
          s4ArchWrapper.style.opacity = '0';  ← INLINE
        }
        if (s4TimelineLayout) {
          s4TimelineLayout.style.opacity = '0';  ← INLINE KILLS TIMELINE
        }
        │
     └─ Inline styles are now:
        ├─ s4TimelineLayout.style.opacity = '0' (INLINE)
        └─ CSS .all-boxes-lit rule: opacity: 1 (IGNORED)
           (Inline has higher CSS specificity)

T=182ms
  └─ User sees Scene 4 content HIDDEN
  └─ Cards invisible (opacity: 0 from inline style)
  └─ Background visible but cards not glowing
  └─ Even though .all-boxes-lit class is still present!
  └─ ❌ VISUAL MISMATCH: Class is present, but styles not applied
```

### SCENARIO C: Exiting Dark Mode (Button Click Again)

```
T=0ms (Button clicked while in dark mode)
  └─ User clicks "Resume Invite" button again
  └─ Event handler fires
  └─ isBoxesLitMode toggled to false
  └─ scene4.classList.toggle('all-boxes-lit')
     └─ .all-boxes-lit class REMOVED (toggle removes it)
  └─ underwaterVideo.style.opacity = '0'
  └─ unlockScrollAndZoom()
  └─ butterflyInteractBtn.textContent = 'Interact with Butterfly'
  └─ fog.classList.add('white-transition')
  └─ window.scrollTo({ top: maxScroll * 0.71, behavior: 'smooth' })

T=1-150ms [Smooth scroll animation]
  └─ Similar to Scenario A
  └─ Scroll progress changes to 0.71
  └─ applyTransition runs multiple times
  └─ .all-boxes-lit class is GONE (was removed at T=0)
  └─ CSS rules no longer apply
  └─ Scroll handler sets inline styles normally
  └─ Scene 4 fades out, Scene 5 fades in
  └─ ✅ Correct behavior
```

---

## 7. JAVASCRIPT CODE THAT COULD INTERFERE

### Code Location 1: Scroll Handler Sets Inline Styles
**File**: [main.js](main.js#L932-L1050)

```javascript
function applyTransition(p) {
  // ... many lines ...
  
  if (s4Active) {
    // Lines 1016-1032: Sets inline styles when s4Active = true
    if (s4ArchImg) {
      s4ArchImg.style.transform = 'scale(' + archScale + ')';
      s4ArchImg.style.opacity = archOpacity.toString();
    }
    // ... more inline styles ...
  } else {
    // Lines 1034-1050: CLEARS inline styles when s4Active = false
    if (s4ArchWrapper) {
      s4ArchWrapper.style.opacity = '0';  // ← THIS IS THE CULPRIT
    }
    if (s4TimelineLayout) {
      s4TimelineLayout.style.opacity = '0';  // ← KILLS VISIBILITY
    }
    // ... more resets ...
  }
}
```

**How It Interferes**:
- When `p >= 0.70`, `s4Active = false`
- Inline styles are set to hide elements
- These OVERRIDE any `.all-boxes-lit` CSS rules
- Even though `.all-boxes-lit` class is present, styles don't apply

### Code Location 2: Button Click Scroll Behavior
**File**: [main.js](main.js#L208-L214)

```javascript
window.scrollTo({
  top: targetScroll,
  behavior: 'smooth'  // ← 150-200ms animation
});
```

**How It Interferes**:
- Smooth scroll animation takes time
- During this time, scroll handler fires multiple times per frame
- Scroll progress changes continuously
- If scroll goes past p=0.70, scroll handler hides elements

### Code Location 3: No Check for isBoxesLitMode in Scroll Handler
**File**: [main.js](main.js#L868-L890)

**Missing Code**:
```javascript
function applyTransition(p) {
  // Scroll handler should check:
  // if (isBoxesLitMode) {
  //   // Force Scene 4 to stay visible regardless of p value
  //   s4Active = true;
  // } else {
  //   // Normal p-based logic
  //   s4Active = (p >= 0.42 && p < 0.70);
  // }
  
  // But it doesn't! So isBoxesLitMode is ignored.
}
```

---

## 8. POSSIBLE RACE CONDITIONS BETWEEN SCROLL EVENTS AND BUTTON CLICK

| Timeline | Button State | Scroll State | Visible? | Why |
|----------|--------------|--------------|----------|-----|
| Before click | N/A | p=0.50 (Scene 4 active) | ✅ | s4Active = true |
| Click button | Toggle class ON | Scroll starts to 0.69 | ✅ | s4Active = true during scroll |
| Mid-scroll | Class ON | p=0.68 | ✅ | Inline styles from scroll handler apply |
| Scroll complete | Class ON | p=0.69 | ✅ | Good position, cards visible |
| User scrolls further | Class ON | p=0.71 | ❌ | s4Active = false, inline opacity = 0 |
| Manual scroll back | Class ON | p=0.68 | ✅ | s4Active = true again |
| Click button again | Toggle class OFF | Scroll starts to 0.71 | ✅ → ❌ | Class removed, no CSS to override inline |

---

## 9. SUMMARY OF ISSUES

### Critical Issues

| # | Issue | File | Line | Severity |
|---|-------|------|------|----------|
| 1 | Inline styles override `.all-boxes-lit` CSS | [main.js](main.js#L1014) | 1014+ | 🔴 CRITICAL |
| 2 | Scroll handler sets `opacity: 0` when `s4Active = false` | [main.js](main.js#L1044) | 1044 | 🔴 CRITICAL |
| 3 | `isBoxesLitMode` flag never checked by scroll handler | [main.js](main.js#L868) | 868-890 | 🔴 CRITICAL |
| 4 | Smooth scroll animation duration causes race condition | [main.js](main.js#L208) | 208 | 🟠 HIGH |
| 5 | No guard preventing inline style overwrites | [main.js](main.js#L932) | 932 | 🟠 HIGH |

### How They Interact

```
Button Click (0ms)
    ↓
Add .all-boxes-lit class ✅
    ↓
Scroll Handler Starts
    ↓
Inline Styles Set (higher CSS specificity)
    ↓
If p > 0.70 → inline opacity = 0 ❌
    ↓
CSS .all-boxes-lit rule ignored
    ↓
Elements hidden despite class being present
```

---

## 10. WHAT SHOULD HAPPEN VS WHAT ACTUALLY HAPPENS

### Expected Behavior
```
Click "Interact with Butterfly"
  ↓
.all-boxes-lit class added to scene4
  ↓
CSS rules apply: darker background, lit cards, underwater waves visible
  ↓
User sees Scene 4 in "dark mode" with glowing cards
  ↓
Scroll and zoom locked
  ↓
[Stays visible while in this mode]
  ↓
Click "Resume Invite"
  ↓
.all-boxes-lit class removed
  ↓
Transition to Scene 5
```

### Actual Behavior
```
Click "Interact with Butterfly"
  ↓
.all-boxes-lit class added to scene4 ✅
  ↓
Scroll animation starts
  ↓
Scroll handler sets inline styles ✅
  ↓
[While scroll progress < 0.70]
Cards visible, dark mode active ✅
  ↓
[If scroll progress > 0.70]
Scroll handler sets inline opacity = 0
  ↓
.all-boxes-lit CSS rule ignored (inline has higher specificity)
  ↓
User sees Scene 4 HIDDEN
  ❌ MISMATCH: Class present but styles not applied
```

---

## CONCLUSION

The core problem is **CSS Specificity Conflict**:

1. **Inline styles** (set by scroll handler) have higher CSS specificity
2. When `s4Active = false`, scroll handler sets `inline opacity = 0`
3. This **overrides** the `.all-boxes-lit` class CSS rules
4. Result: Elements hidden even though `.all-boxes-lit` class is present

The secondary issue is **State Desynchronization**:

1. Button maintains `isBoxesLitMode` flag
2. Scroll handler uses only `p` (scroll progress) to determine state
3. These two can diverge
4. Result: Button thinks mode is ON, but scroll handler thinks Scene 4 is inactive

**Both issues need fixing to restore correct behavior.**
