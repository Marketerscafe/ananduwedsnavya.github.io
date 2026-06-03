# Scene 6 Visibility & Scroll Triggering Analysis

**Date**: 2026-06-03  
**Status**: 🔴 **CRITICAL BLOCKERS IDENTIFIED**

---

## Executive Summary

Scene 6 has **6 major blockers** preventing visibility. The primary issues are:
1. **Positioning conflict**: Both Scene 5 and 6 are `position: relative` (not fixed), causing layout overlap
2. **Z-index hierarchy failure**: Scene 5 (z-index: 35) overlaps Scene 6 (z-index: 40) visually
3. **Simultaneous display state**: Both scenes set `display: flex` during p ∈ [0.80, 1.00)
4. **Opacity math**: Scene 6 starts at opacity 0 at p=0.80, only becomes fully visible at p=1.00
5. **PointerEvents blocking**: Scene 5 pointerEvents remain 'auto' when Scene 6 should be interactive

---

## 1. Scroll Progress Calculation & maxScroll Computation

### Current Implementation (main.js:362-363)
```javascript
const maxScroll = document.body.scrollHeight - window.innerHeight;
const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
```

### Analysis

| Parameter | Value | Status |
|-----------|-------|--------|
| **maxScroll** | `scrollHeight - innerHeight` | ✓ Correct formula |
| **scrollY** | `window.scrollY` | ✓ Correct |
| **rawProgress** | `scrollY / maxScroll` | ✓ Normalized 0-1 |
| **Clamping** | `Math.min(Math.max(..., 0), 1)` | ✓ Good |

### Smoothing Applied (main.js:367-373)
```javascript
smoothProgress += (rawProgress - smoothProgress) * LERP;
if (Math.abs(smoothProgress - rawProgress) < 0.0005) {
  smoothProgress = rawProgress;
}
```

**Status**: ✓ **No issues detected**

---

## 2. Scene 6 Trigger Logic (main.js:525-535)

### Current Code
```javascript
if (p >= 0.80 && p < 1.00) {
  s4Active = false;
  s4Opacity = 0.0;
  s5Active = true;
  s5Opacity = 1.0;
  s6Active = true;
  // Scene 6 fades in as user scrolls from 0.80 to 1.00
  s6Opacity = Math.min((p - 0.80) / 0.20, 1.0);
} else if (p >= 1.00) {
  s4Active = false;
  s4Opacity = 0.0;
  s5Active = false;
  s5Opacity = 0.0;
  s6Active = true;
  s6Opacity = 1.0;
}
```

### Trigger Analysis

| Progress Range | s6Active | s6Opacity | Status | Issue |
|---|---|---|---|---|
| p < 0.80 | `false` | N/A | Hidden ✓ | - |
| p = 0.80 | `true` | `0.0` | Appears but invisible | ⚠️ Fadeout conflict with Scene 5 |
| p = 0.90 | `true` | `0.5` | Semi-visible | ⚠️ Both scenes at 100% opacity |
| p = 1.00 | `true` | `1.0` | Fully visible | ⚠️ Hard cutoff for Scene 5 |
| p > 1.00 | `true` | `1.0` | Fully visible | ✓ Works |

### Critical Issue: Simultaneous Scene Activation
```
Timeline:
  p ∈ [0.70, 0.80):  Scene 5 fades in (s5Opacity = (p-0.70)/0.10)
  p ∈ [0.80, 1.00):  BOTH SCENE 5 & 6 ACTIVE ❌
                     Scene 5: s5Opacity = 1.0, display='flex', z-index=35
                     Scene 6: s6Opacity = (p-0.80)/0.20, display='flex', z-index=40
  p ≥ 1.00:          Scene 5 deactivates (s5Active=false) ✓
```

**Status**: 🔴 **BLOCKER** - Dual activation during p ∈ [0.80, 1.00) causes occlusion

---

## 3. ScrollHeight Calculation with Scene 5 Relative Positioning

### HTML Structure
```html
<section class="scene-5-container" id="scene-5-container">...</section>
<section class="scene-6-container" id="scene-6-container">...</section>
<div class="scroll-spacer" id="scroll-spacer"></div>
```

### CSS Positioning (style.css)
```css
.scene-5-container {
  position: relative;  /* 📍 Takes space in document flow */
  height: 100vh;
  height: 100dvh;
}

.scene-6-container {
  position: relative;  /* 📍 Takes space in document flow */
  height: 100vh;
  height: 100dvh;
}

.scroll-spacer {
  height: 100vh;
  height: 100dvh;
  background-color: transparent;
}
```

### ScrollHeight Contribution
```
Total scrollHeight = 
  (Scene 1 video height) +
  (Scene 2 caustic height) +
  (Scene 3 champagne height) +
  (Scene 4 arch/cards height) +
  (Scene 5 height: 100vh) +           ← Takes space (relative)
  (Scene 6 height: 100vh) +           ← Takes space (relative)
  (Scroll spacer: 100vh)
  
Result: Total scrollHeight ≈ 600+ vh (depends on earlier scenes)
```

### MaxScroll Calculation Impact
```javascript
// At page load, assume total scrollHeight = 600vh
const maxScroll = (600vh) - (innerHeight=100vh) = 500vh

// For Scene 6 to be at p=0.80:
// scrollY needed = 0.80 × 500vh = 400vh

// For Scene 6 to be at p=1.00:
// scrollY needed = 1.00 × 500vh = 500vh (bottom of page)
```

**Status**: ✓ **ScrollHeight calculation is correct**  
**Note**: Scene 5 being relative doesn't break the math; it just adds to total height.

---

## 4. Z-Index Values for Scene 6

### Current Z-Index Configuration

#### CSS (style.css:2272-2289)
```css
.scene-6-container {
  z-index: 32;      /* ⚠️ BASE STATE */
  opacity: 0;
  pointer-events: none;
}

.scene-6-container.active {
  z-index: 32;      /* ⚠️ SAME - No change! */
  pointer-events: auto;
}
```

#### JavaScript (main.js:805)
```javascript
if (s6Active) {
  scene6.classList.add('active');
  scene6.removeAttribute('aria-hidden');
  // ...
  scene6.style.zIndex = '40';  /* 📍 Set to 40 in JS */
  scene6.style.transition = 'none';
}
```

### Z-Index Stack at p ∈ [0.80, 1.00)
```
Layer Stack (top to bottom):
  40 ← Scene 6 (JS applied)
  35 ← Scene 5 (JS applied, line 754)
  28 ← Scene 4 (if still active)
  18 ← Scene 2
  12 ← Ambient light
  10 ← Video container
```

### Critical Problem: Layout Stacking Context
```
Visual ordering by z-index: CORRECT (40 > 35)
BUT
Visual ordering by DOM position: WRONG
  - Scene 5 in DOM comes BEFORE Scene 6
  - Both are position: relative (establish stacking contexts)
  - Scene 5 div wraps its entire 100vh height
  - Scene 6 div comes after, also 100vh
  
Result: Scene 5 occupies viewport visually FIRST,
         Scene 6 appears below it in scroll flow
```

**Status**: 🔴 **BLOCKER** - Z-index appears correct numerically but layout positioning defeats it

---

## 5. Scene 6 Opacity Calculation

### Formula (main.js:530)
```javascript
s6Opacity = Math.min((p - 0.80) / 0.20, 1.0);
```

### Opacity Progression
```
Progress Range    Calculation              Result    Status
─────────────────────────────────────────────────────────
p = 0.80         (0.80 - 0.80) / 0.20  =  0.0       Invisible ⚠️
p = 0.85         (0.85 - 0.80) / 0.20  =  0.25      25% opaque
p = 0.90         (0.90 - 0.80) / 0.20  =  0.5       50% opaque
p = 0.95         (0.95 - 0.80) / 0.20  =  0.75      75% opaque
p = 1.00         (1.00 - 0.80) / 0.20  =  1.0       100% opaque ✓
p > 1.00         min(>1, 1.0)           =  1.0       Clamped ✓
```

### Fade-In Duration
```
Time to full visibility from p=0.80 to p=1.00:
  Δp = 0.20 (progress range)
  User scroll time depends on: (0.20 × maxScroll) / scrollSpeed
  
Example: If maxScroll = 500vh and user scrolls 50vh/sec:
  Time = (0.20 × 500vh) / (50vh/sec) ≈ 2 seconds
```

### Scene 5 Overlap During This Period
```
At p = 0.80 to 1.00:
  Scene 5: s5Opacity = 1.0    (FULLY VISIBLE)
  Scene 6: s6Opacity = 0.0→1.0 (FADING IN)
  
Scene 5 remains fully opaque while Scene 6 fades in!
This creates a fade-through transition ONLY if z-index works.
```

**Status**: ⚠️ **LOGIC OK, BUT BLOCKED BY LAYOUT ISSUE**

---

## 6. CSS Conflicts with scene-6-container Visibility

### Base CSS (style.css:2272-2288)
```css
.scene-6-container {
  position: relative;
  top: auto;
  left: auto;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 32;
  opacity: 0;              /* 📍 Starts invisible */
  pointer-events: none;    /* 📍 Blocks interactions */
  will-change: opacity;
}

.scene-6-container.active {
  z-index: 32;
  pointer-events: auto;    /* 📍 Enabled via .active class */
}
```

### CSS Issues Identified

| Issue | Line | Impact | Severity |
|-------|------|--------|----------|
| `opacity: 0` | 2287 | Initially invisible | ✓ OK (updated by JS) |
| `pointer-events: none` | 2288 | Initially non-interactive | ✓ OK (updated by JS) |
| `position: relative` | 2272 | Takes space in flow | 🔴 **BLOCKER** |
| `z-index: 32` (CSS) | 2285 | Overridden by JS (40) | ✓ OK |
| No `display: none` | - | Display always flex | ✓ OK |
| No `opacity: 0 !important` | - | JS opacity can override | ✓ OK |

### Layout Rendering Conflict
```css
/* These are applied by JS correctly: */
scene6.style.display = 'flex';      /* Enables rendering */
scene6.style.opacity = s6Opacity;   /* Fades in */
scene6.style.zIndex = '40';         /* Layers above Scene 5 */

/* BUT CSS position: relative causes: */
/* Scene 5 viewport = 0 to 100vh */
/* Scene 6 viewport = 100vh to 200vh (below Scene 5 in scroll) */
/* User sees Scene 5 until they scroll to 100vh+ */
```

**Status**: 🔴 **MAJOR BLOCKER** - Relative positioning creates visual stacking order that z-index cannot overcome

---

## 7. aria-hidden Attributes Blocking Visibility

### HTML Initial State (index.html:363-364)
```html
<section
  class="scene-6-container"
  id="scene-6-container"
  aria-hidden="true"    <!-- 📍 Accessibility: Hidden from screen readers -->
>
```

### JavaScript aria-hidden Management (main.js:777-815)

#### When s6Active = true:
```javascript
scene6.classList.add('active');
scene6.removeAttribute('aria-hidden');  /* 📍 Removes for accessibility */
scene6.style.display = s6Display;      /* display: 'flex' */
scene6.style.opacity = s6OpStr;        /* opacity value */
```

#### When s6Active = false:
```javascript
scene6.classList.remove('active');
scene6.setAttribute('aria-hidden', 'true');  /* 📍 Re-applies */
```

### aria-hidden Impact on Rendering
- **Accessibility API**: Hidden from screen readers ✓ (correct)
- **Visual rendering**: NO EFFECT (aria-hidden doesn't hide visually)
- **Browser layout**: NO EFFECT (aria-hidden doesn't affect layout)

```javascript
// aria-hidden status at different scroll points:
p < 0.80:  aria-hidden="true"   // ✓ Not rendering anyway (opacity:0)
p ≥ 0.80:  aria-hidden removed  // ✓ Renders and is visible
p ≥ 1.00:  aria-hidden removed  // ✓ Stays visible
```

**Status**: ✓ **aria-hidden is correctly managed, NOT blocking visibility**

---

## 8. Display:none or Opacity:0 Stuck States

### Display Lifecycle
```javascript
// Line 777: When s6Active = true
const s6Display = 'flex';
scene6.style.display = s6Display;  /* Applied every frame if changed */

// Line 784: When s6Active = false
const s6Display = 'none';
scene6.style.display = s6Display;
```

### Opacity Lifecycle
```javascript
// Line 779: When s6Active = true
const s6OpStr = s6Opacity.toString();
scene6.style.opacity = s6OpStr;  /* Fades 0→1 smoothly */

// Line 794: When s6Active = false
const s6OpStr = '0';
scene6.style.opacity = s6OpStr;
```

### Performance Cache (main.js:250-252)
```javascript
let lastScene6Display = '';      /* Tracks last display value */
let lastScene6Opacity = -1;      /* Tracks last opacity value */

// Applied with cache check:
if (s6Display !== lastScene6Display) {
  scene6.style.display = s6Display;
  lastScene6Display = s6Display;
}
```

### Stuck State Analysis
```
Scenario 1: Scene 6 remains invisible after p≥0.80
  Possible causes:
  - display: 'none' stuck (NO - cache logic is correct)
  - opacity: 0 stuck (NO - incremented by formula)
  - s6Active never becomes true (CHECK trigger logic ✓)
  - Display calc never reaches 'flex' (NO - cache triggers update)

Scenario 2: Scene 6 visible but behind Scene 5
  Causes:
  - z-index insufficient (40 should win BUT layout matters)
  - Scene 5 z-index: 35 doesn't lower (SHOULD LOWER IT)
  - Both display: flex creates stacking context conflict
```

**Status**: ✓ **No display:none or opacity:0 stuck states**  
**BUT**: 🔴 Layout stacking context defeats CSS z-index

---

## Summary of All Blockers

### 🔴 CRITICAL BLOCKERS (Prevent Visibility)

1. **Layout Stacking Order (HIGHEST PRIORITY)**
   - Scene 5 & 6 both `position: relative` in document flow
   - Scene 5 occupies viewport at scroll position 100vh-200vh
   - Scene 6 appears at scroll position 200vh-300vh
   - **Fix**: Make Scene 6 `position: fixed` or use `transform` for layering

2. **Simultaneous Activation During p ∈ [0.80, 1.00)**
   - Both scenes set `display: flex` at same time
   - Scene 5 opacity stays at 1.0, Scene 6 fades in
   - Scene 5 needs to start fading out AT p=0.80
   - **Fix**: Add Scene 5 fade-out during Scene 6 fade-in period

3. **Scene 5 Z-Index Not Reduced**
   - Scene 5 z-index stays 35 while Scene 6 is 40
   - Stacking context doesn't respect z-index when layout is relative
   - **Fix**: Set Scene 5 z-index to 30 (or lower) when p≥0.80

4. **Scene 5 PointerEvents Not Disabled**
   - Scene 5 pointerEvents remain 'auto' during p ∈ [0.80, 1.00)
   - Blocks mouse/touch interaction with Scene 6
   - **Fix**: Set Scene 5 pointerEvents='none' when p≥0.80 AND s6Opacity>0.3

### ⚠️ SECONDARY ISSUES

5. **Scene 6 Starts Invisible at p=0.80**
   - s6Opacity = 0 at p=0.80, full at p=1.00
   - Hard to detect without scrolling to exact threshold
   - **Fix**: Pre-fade Scene 6 to 20% opacity at p=0.80

6. **Hard Transition at p=1.00**
   - Scene 5 deactivates instantly (s5Active=false)
   - No smooth fade-out transition
   - **Fix**: Implement Scene 5 fade-out from p=0.90 to p=1.00

---

## Recommendations

### Quick Fix (Emergency)
```javascript
// Make Scene 6 override Scene 5 during overlap:
if (p >= 0.80 && p < 1.00) {
  s5Active = true;
  s5Opacity = 1.0;
  s5PointerEvents = 'none';  // ← Add this
  scene5.style.pointerEvents = 'none';  // ← Add this
  
  s6Active = true;
  s6Opacity = Math.min((p - 0.80) / 0.20, 1.0);
}
```

### Proper Fix (Recommended)
```javascript
// Implement overlap phase with smooth transition:
if (p >= 0.80 && p < 1.00) {
  // Scene 5 fade-out begins at p=0.80
  s5Active = true;
  s5Opacity = Math.max(0, 1.0 - (p - 0.80) / 0.20);  // Fade 1→0
  s5PointerEvents = s5Opacity > 0.3 ? 'auto' : 'none';
  
  // Scene 6 fade-in begins at p=0.80
  s6Active = true;
  s6Opacity = Math.min((p - 0.80) / 0.20, 1.0);  // Fade 0→1
}
```

### CSS Fix
```css
.scene-6-container {
  position: fixed;  /* Change from relative */
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  /* Rest remains same */
}
```

---

## Test Checklist

- [ ] Scroll to p=0.80 and verify Scene 6 becomes visible
- [ ] Scroll through p ∈ [0.80, 1.00) and verify Scene 5 fades out, Scene 6 fades in
- [ ] Verify Scene 6 is fully opaque at p≥1.00
- [ ] Test mouse/touch interaction on Scene 6 at p≥0.85
- [ ] Verify z-index layering (Scene 6 above Scene 5)
- [ ] Check aria-hidden attributes (should be removed when visible)
- [ ] Mobile portrait/landscape viewport tests
- [ ] Verify scroll spacer extends document height correctly

