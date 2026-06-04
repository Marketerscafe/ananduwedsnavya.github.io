# EXHAUSTIVE SCENE 4 CSS CASCADE & STACKING CONTEXT ANALYSIS

## 1. POSITION CONTEXT & LAYOUT

### `.scene-4-container` (Base Rule)
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `fixed` | ✅ OK | Creates new stacking context |
| `inset` | `0` | ✅ OK | Shorthand for top, right, bottom, left = 0 |
| `top` | `0` (from inset) | ✅ OK | Locks to viewport top |
| `left` | `0` (from inset) | ✅ OK | Locks to viewport left |
| `right` | `0` (from inset) | ✅ OK | Locks to viewport right |
| `bottom` | `0` (from inset) | ✅ OK | Locks to viewport bottom |
| `width` | `100%` | ✅ OK | Fills viewport width |
| `height` | `100%` | ✅ OK | Fills viewport height |
| `height` | `100dvh` | ✅ OK | Dynamic viewport height override |

### `.scene-4-container.active`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | Inherited from base | ✅ OK | Stays fixed |
| `inset` | Inherited from base | ✅ OK | Remains locked |

### `.scene-4-container.all-boxes-lit`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `relative` | ⚠️ **PROBLEM** | **OVERRIDES** `fixed` - may interfere with stacking context! |

**🔴 CRITICAL ISSUE #1**: Position context changed from `fixed` to `relative` in all-boxes-lit state!

### `.scene-4-content`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `relative` | ✅ OK | Creates new stacking context for children |
| `width` | `100%` | ✅ OK | Fills parent |
| `height` | `100%` | ✅ OK | Fills parent |

### `.s4-arch-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `absolute` | ✅ OK | Positioned relative to `.scene-4-content` |
| `top` | `3vh` | ✅ OK | Desktop positioning |
| `left` | `50%` | ✅ OK | Horizontal centering |
| `transform` | `translateX(-50%) scale(1)` | ✅ OK | Centers and scales |
| `bottom` | `auto` | ✅ OK | Prevents conflicting positioning |
| `overflow` | `visible` | ✅ OK | Allows children to extend beyond bounds |

### `.s4-heading-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `absolute` | ✅ OK | Positioned absolutely |
| `left` | `50%` | ✅ OK | Horizontal center |
| `top` | `50%` | ✅ OK | Vertical center |
| `transform` | `translate(-50%, -50%)` | ✅ OK | Centers both axes |

### `.s4-timeline-layout`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `absolute` | ✅ OK | Full coverage |
| `top` | `0` | ✅ OK | Aligns to top |
| `left` | `0` | ✅ OK | Aligns to left |
| `width` | `100%` | ✅ OK | Fills parent |
| `height` | `100%` | ✅ OK | Fills parent |
| `overflow` | `visible` | ✅ OK | Doesn't clip children |

### `.s4-card-container`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `absolute` | ✅ OK | Stacked vertically |
| `left` | `50%` | ✅ OK | Centered |
| `transform` | `translateX(-50%) scale(1)` | ✅ OK | Centering transform |

### `#butterfly-canvas`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `position` | `absolute` | ✅ OK | Positioned within `.scene-4-content` |
| `top` | `50%` | ✅ OK | Vertical center |
| `left` | `50%` | ✅ OK | Horizontal center |
| `transform` | `translate(-50%, -50%)` | ✅ OK | Perfect center |
| `overflow` | `hidden` | ✅ OK | Clips to border-radius |

---

## 2. DISPLAY PROPERTIES

### `.scene-4-container`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | `flex` | ✅ OK | Flex layout for centering |
| `justify-content` | `center` | ✅ OK | Horizontal center |
| `align-items` | `center` | ✅ OK | Vertical center |

### `.scene-4-content`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | NOT SET | ✅ OK | Inherits from parent (flex) |

### `.s4-arch-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | `flex` | ✅ OK | Flex layout |
| `justify-content` | `center` | ✅ OK | Horizontal center |
| `align-items` | `flex-end` | ✅ OK | Aligns to bottom |

### `.s4-heading-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | `flex` | ✅ OK | Flex layout |
| `justify-content` | `center` | ✅ OK | Centers content |
| `align-items` | `center` | ✅ OK | Centers content |

### `.s4-timeline-layout`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | NOT SET | ✅ OK | Inherits default block display |

### `.s4-card-content`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | `flex` | ✅ OK | Flex layout |
| `flex-direction` | `column` | ✅ OK | Stacks children vertically |
| `justify-content` | `center` | ✅ OK | Centers content |
| `align-items` | `center` | ✅ OK | Centers content |

### `#butterfly-canvas`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `display` | NOT SET | ✅ OK | Default (block) |

---

## 3. OVERFLOW PROPERTIES

### `.scene-4-container`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | NOT SET | ✅ OK | Defaults to visible |

### `.scene-4-content`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | `hidden` | ⚠️ **POTENTIAL ISSUE** | **Might clip Scene 4 elements!** |

**⚠️ WARNING #2**: `overflow: hidden` on `.scene-4-content` may clip children that extend outside the viewport boundaries.

### `.s4-arch-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | `visible` | ✅ OK | Explicitly allows overflow |

### `.s4-heading-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | `visible` | ✅ OK | Allows heading to extend |

### `.s4-timeline-layout`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | `visible` | ✅ OK | Allows cards to extend |

### `.s4-card-container`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | NOT SET | ✅ OK | Defaults to visible |

### `#butterfly-canvas`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | `hidden` | ✅ OK | Clips 3D model to border-radius |

### `.underwater-waves-video`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | NOT SET | ✅ OK | Video is fixed, fills viewport |

### `.underwater-waves-overlay`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `overflow` | NOT SET | ✅ OK | Fixed overlay, no overflow issues |

---

## 4. BACKGROUND PROPERTIES

### `.scene-4-container` (Base State)
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `background-color` | `#F5F2EB` | ✅ OK | Warm ivory, opaque |

### `.scene-4-container.all-boxes-lit`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `background-color` | `rgba(10, 8, 5, 0.3)` | ✅ OK | Transparent dark overlay (30%) |
| `background-image` | `none` | ✅ OK | Clears any images |
| `background-size` | `cover, cover` | ✅ OK | Not relevant with no image |
| `background-position` | `center, center` | ✅ OK | Not relevant with no image |
| `background-attachment` | `fixed` | ✅ OK | Would be fixed if image exists |

### `.underwater-waves-overlay`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `background` | `rgba(10, 8, 5, 0.4)` | ✅ OK | Dark vignette (40%) |

**✅ No background covering issues identified.**

---

## 5. DIMENSIONS (Width/Height)

### `.scene-4-container`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `100%` | ✅ OK | Full viewport |
| `height` | `100%` | ✅ OK | Full viewport |
| `height` | `100dvh` | ✅ OK | Dynamic viewport height |

### `.scene-4-content`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `100%` | ✅ OK | Full parent |
| `height` | `100%` | ✅ OK | Full parent |

### `.s4-arch-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `height` | `92vh` | ✅ OK | 92% of viewport |
| `width` | `auto` | ✅ OK | Maintains aspect ratio |
| `max-width` | `90vw` | ✅ OK | Max 90% viewport width |
| `aspect-ratio` | `2 / 3` | ✅ OK | Locked ratio |

### `.s4-heading-wrapper`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `52%` | ✅ OK | 52% of parent |
| `max-width` | `52%` | ✅ OK | Limited to 52% |
| `height` | `clamp(60px, 12vh, 120px)` | ✅ OK | Responsive height |

### `.s4-timeline-layout`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `100%` | ✅ OK | Full parent |
| `height` | `100%` | ✅ OK | Full parent |

### `.s4-card-container`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `62%` | ✅ OK | 62% of parent |
| `max-width` | `560px` | ✅ OK | Max 560px |
| `min-height` | `200px` | ✅ OK | Minimum height set |

### `.s4-card-content`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `100%` | ✅ OK | Fills container |
| `min-height` | `200px` | ✅ OK | Minimum height set |

### `#butterfly-canvas`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `58%` | ✅ OK | 58% of parent |
| `height` | `42%` | ✅ OK | 42% of parent |

### `.underwater-waves-video`
| Property | Value | Issue? | Notes |
|----------|-------|--------|-------|
| `width` | `100%` | ✅ OK | Full viewport |
| `height` | `100%` | ✅ OK | Full viewport |

**✅ No zero-width or zero-height issues found.**

---

## 6. VISIBILITY & OPACITY CHAIN (CRITICAL)

### **ROOT ELEMENT: `.scene-4-container`**

#### Base State (Hidden by Default)
```css
.scene-4-container {
  opacity: 0;                /* ← HIDDEN by default */
  pointer-events: none;
}
```
**State**: INVISIBLE (opacity: 0)

#### When `.active` Class Applied
```css
.scene-4-container.active {
  opacity: 1;               /* ← BECOMES VISIBLE */
  pointer-events: auto;
  z-index: 1000;
}
```
**State**: VISIBLE (opacity: 1)

#### When `.all-boxes-lit` Class Applied (WITHOUT `.active`)
```css
.scene-4-container.all-boxes-lit {
  opacity: /* NOT DEFINED */   /* ← INHERITS opacity: 0 FROM BASE! */
  background-color: rgba(10, 8, 5, 0.3);
  position: relative;
  z-index: 1000;
}
```
**State**: INVISIBLE! 🔴 **CRITICAL BUG** - Falls back to `opacity: 0` from base rule!

**👉 FIX**: Add `opacity: 1;` to `.scene-4-container.all-boxes-lit`

---

### CHILD ELEMENTS OPACITY CASCADE

| Element | Rule | Base Opacity | .active Opacity | .all-boxes-lit Opacity | Issue? | Notes |
|---------|------|--------------|-----------------|------------------------|--------|-------|
| `.scene-4-content` | None specified | Inherits: 1.0 | Inherits: 1.0 | Inherits: 0 🔴 | YES | Invisible when .all-boxes-lit active without .active |
| `.s4-main-heading` | `.s4-main-heading { opacity: 1 }` | 1.0 | 1.0 | Hidden by parent | YES | Fully visible but hidden by invisible container |
| `.s4-card-content` | `opacity: 0.0` | 0.0 | 0.0 | 0.0 | YES | Always starts hidden, fades in via JS |
| `.s4-card-content` (`.all-boxes-lit`) | opacity: 1 | 0.0 | 0.0 | 1.0 ✅ | PARTIAL | Opacity set in `.all-boxes-lit` state ONLY |
| `#butterfly-canvas` | None specified | Inherits: 1.0 | Inherits: 1.0 | Hidden by parent | YES | Controlled by JavaScript bfOpacityMult |
| `.underwater-waves-video` (base) | `opacity: 0` | 0.0 | 0.0 | 0.0 | YES | Video starts hidden |
| `.underwater-waves-video` (`.all-boxes-lit`) | `opacity: 0.75` | 0.0 | 0.0 | 0.75 | PARTIAL | Only visible in .all-boxes-lit state |
| `.underwater-waves-overlay` (base) | `opacity: 0` | 0.0 | 0.0 | 0.0 | YES | Overlay starts hidden |
| `.underwater-waves-overlay` (`.all-boxes-lit`) | `opacity: 1` | 0.0 | 0.0 | 1.0 | PARTIAL | Only visible in .all-boxes-lit state |

---

### VISIBILITY PROPERTY
**No `visibility: hidden` properties found** ✅

---

## 7. POINTER-EVENTS ISSUES

### Container Level
| Element | Rule | Value | Issue? | Notes |
|---------|------|-------|--------|-------|
| `.scene-4-container` | `pointer-events: none` (base) | `none` | ⚠️ BLOCKS INTERACTION | Intentional when hidden |
| `.scene-4-container.active` | `pointer-events: auto` | `auto` | ✅ OK | Re-enables when active |
| `.scene-4-container.all-boxes-lit` | NOT SET | Inherits: `none` | 🔴 **BUG** | Cannot interact without explicit `pointer-events: auto` |

**🔴 CRITICAL ISSUE #3**: `.scene-4-container.all-boxes-lit` does NOT set `pointer-events: auto`, so interactions remain blocked!

### Child Elements
| Element | Value | Issue? | Notes |
|---------|-------|--------|-------|
| `.scene-4-content` | NOT SET | ✅ OK | Inherits from parent |
| `.s4-timeline-layout` | `pointer-events: auto` | ✅ OK | Explicitly enabled |
| `.s4-heading-wrapper` | `pointer-events: auto` | ✅ OK | Explicitly enabled |
| `.s4-main-heading` | `pointer-events: auto` | ✅ OK | Explicitly enabled |
| `.underwater-waves-video` | `pointer-events: none` | ✅ OK | Video doesn't need interaction |
| `.underwater-waves-overlay` | `pointer-events: none` | ✅ OK | Overlay is passive |
| `#butterfly-canvas` | `pointer-events: none` | ✅ OK | Canvas handles its own |

---

## 8. TRANSFORM PROPERTIES

### Position-Based Transforms
| Element | Transform | Issue? | Notes |
|---------|-----------|--------|-------|
| `.scene-4-container` | NOT SET | ✅ OK | No translation |
| `.s4-arch-wrapper` | `translateX(-50%) scale(1)` | ✅ OK | Centering only |
| `.s4-heading-wrapper` | `translate(-50%, -50%)` | ✅ OK | Perfect centering |
| `.s4-timeline-layout` | NOT SET | ✅ OK | No transform |
| `.s4-card-container` | `translateX(-50%) scale(1)` | ✅ OK | Centering only |
| `#butterfly-canvas` | `translate(-50%, -50%)` | ✅ OK | Perfect centering |
| `.s4-main-heading` | NOT SET | ✅ OK | No translation |
| `.cinematic-transition-fog` | NOT SET | ✅ OK | No transform issues |

**✅ No problematic transforms (no scale(0), no off-screen translations)**

---

## 9. CLIP-PATH & MASK & BORDER-RADIUS

### Clipping Elements
| Element | Property | Value | Issue? | Notes |
|---------|----------|-------|--------|-------|
| `.scene-4-content` | NO clip-path | - | ✅ OK | No clipping |
| `.s4-arch-wrapper` | NO clip-path | - | ✅ OK | No clipping |
| `.s4-card-content` | NO clip-path | - | ✅ OK | No clipping |
| `#butterfly-canvas` | `border-radius` | `40px` | ✅ OK | Circles the butterfly |

### Border Radius (Visual Clipping)
| Element | Value | Issue? | Notes |
|---------|-------|--------|-------|
| `.s4-card-content` | `18px` (base) / `24px` (widescreen) | ✅ OK | Subtle rounding |
| `#butterfly-canvas` | `40px` | ✅ OK | Rounded container |

**✅ No mask or extreme clip-path issues**

---

## 10. Z-INDEX CONFLICTS & STACKING CONTEXT

### Z-Index Hierarchy
```
z-index: 1000 ──── .scene-4-container (MAIN CONTAINER)
                    │
                    ├─ z-index: 9999 ──── .scene-4-content
                    │                       │
                    │                       ├─ z-index: 10 ─── .s4-arch-wrapper
                    │                       │                   │
                    │                       │                   ├─ z-index: 5 ──── .s4-heading-wrapper
                    │                       │                   │
                    │                       │                   ├─ z-index: 3 ──── .s4-timeline-layout
                    │                       │                   │                   │
                    │                       │                   │                   ├─ z-index: 6 ──── .s4-card-container
                    │                       │                   │                   │                   │
                    │                       │                   │                   │                   └─ .s4-card-content
                    │                       │                   │
                    │                       │                   └─ z-index: 4 !important ──── #butterfly-canvas
                    │
                    ├─ z-index: -99999 ──── .underwater-waves-video (EXTREME BACKGROUND)
                    │
                    └─ z-index: 0 ──── .underwater-waves-overlay
```

### Stacking Context Analysis
| Element | Z-Index | Creates Context? | Issue? | Notes |
|---------|---------|------------------|--------|-------|
| `.scene-4-container` | 1000 | YES (position: fixed) | ✅ OK | Main stacking context |
| `.scene-4-container.all-boxes-lit` | 1000 | YES (position: relative creates context) | ⚠️ CHANGES | Position changed to relative! |
| `.scene-4-content` | 9999 | YES (position: relative, z-index) | ✅ OK | Explicit z-index creates context |
| `.s4-arch-wrapper` | 10 | YES (z-index + position absolute) | ✅ OK | Valid stacking context |
| `.s4-heading-wrapper` | 5 | YES (position absolute, will-change) | ✅ OK | Valid context |
| `.s4-timeline-layout` | 3 | YES (position absolute) | ✅ OK | Valid context |
| `.s4-card-container` | 6 | YES (position absolute, z-index) | ✅ OK | Valid context |
| `#butterfly-canvas` | 4 !important | YES (position absolute) | ✅ OK | Important forced context |
| `.underwater-waves-video` | -99999 | NOT (position: fixed but no z-index creates it) | ✅ OK | Explicitly pushed back |
| `.underwater-waves-overlay` | 0 | NOT (position: fixed no context) | ✅ OK | Sits above video |

**⚠️ WARNING #3**: Changing `.scene-4-container` from `position: fixed` to `position: relative` in `.all-boxes-lit` affects stacking context!

---

## 11. WILL-CHANGE HINTS

| Element | Value | Issue? | Notes |
|---------|-------|--------|-------|
| `.scene-4-container` | `opacity` | ✅ OK | Optimizes opacity transitions |
| `.s4-heading-wrapper` | `transform, opacity` | ✅ OK | GPU acceleration hint |
| `.s4-timeline-layout` | `opacity` | ✅ OK | Opacity hints |
| `.s4-card-container` | `opacity, transform` | ✅ OK | Animate-friendly hints |
| `.s4-arch-wrapper` | `transform, opacity` | ✅ OK | GPU hints |

**✅ All will-change directives are appropriate**

---

## 12. TRANSITION PROPERTIES

| Element | Transitions | Issue? | Notes |
|---------|-----------|--------|-------|
| `.scene-4-container` | `opacity 0.8s, background-image 3s, background-color 3s` | ✅ OK | Smooth transitions |
| `.s4-card-content` | `background-color 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.35s` | ✅ OK | Card animations |
| `.s4-card-content::before` | `opacity 0.35s` | ✅ OK | Shine effect |
| `.underwater-waves-video` | `opacity 0.6s` | ✅ OK | Smooth fade |
| `.underwater-waves-overlay` | `opacity 0.3s` | ✅ OK | Quick overlay fade |

**✅ No transition issues**

---

## 13. FILTER PROPERTIES

| Element | Filter | Issue? | Notes |
|---------|--------|--------|-------|
| `.s4-main-heading` | `drop-shadow(0px 8px 14px rgba(74, 36, 31, 0.26))` | ✅ OK | Adds depth |
| `.s4-arch-img` | `none` | ✅ OK | No filters |
| `#butterfly-canvas` (when `.all-boxes-lit`) | `drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))` | ✅ OK | Visibility enhancement |

**✅ No problematic filters**

---

## 14. BOX-SHADOW PROPERTIES

| Element | Box-Shadow | Issue? | Notes |
|---------|-----------|--------|-------|
| `.s4-card-content` (base) | NOT SET | ✅ OK | No shadow base |
| `.s4-card-content.active` | `0 20px 45px rgba(58, 18, 15, 0.08)` | ✅ OK | Subtle shadow |
| `.s4-card-content` (`.all-boxes-lit`) | `0 40px 80px rgba(200, 150, 100, 0.25), 0 0 40px rgba(255, 255, 255, 0.15)` | ✅ OK | Prominent shadow |

**✅ Shadows enhance, not hide elements**

---

## 15. CONTAINER-TYPE & CSS CONTAINER QUERIES

| Element | Property | Value | Issue? | Notes |
|---------|----------|-------|--------|-------|
| `.s4-arch-wrapper` | `container-type` | `inline-size` | ✅ OK | Container query support |

**✅ No problematic container queries**

---

## SUMMARY OF CRITICAL ISSUES

### 🔴 **CRITICAL BUG #1: Missing opacity: 1 on .all-boxes-lit**
**Location**: `.scene-4-container.all-boxes-lit` (line 665)
**Problem**: No `opacity: 1` rule when `.all-boxes-lit` class is applied
**Effect**: Container remains at `opacity: 0` (inherited from base), making all children invisible
**Affected**: Everything in Scene 4 (boxes, butterfly, video, heading)
**Fix**: Add `opacity: 1;` to `.scene-4-container.all-boxes-lit`

### 🔴 **CRITICAL BUG #2: Missing pointer-events: auto on .all-boxes-lit**
**Location**: `.scene-4-container.all-boxes-lit` (line 665)
**Problem**: No `pointer-events: auto` rule, inherits `none` from base
**Effect**: Cannot interact with elements in Scene 4
**Fix**: Add `pointer-events: auto;` to `.scene-4-container.all-boxes-lit`

### ⚠️ **WARNING #1: Position context change in .all-boxes-lit**
**Location**: `.scene-4-container.all-boxes-lit` (line 671)
**Problem**: Changes `position: fixed` (from base) to `position: relative`
**Effect**: Affects stacking context creation, may interfere with layering
**Recommendation**: Use explicit `position: fixed` to maintain consistent stacking context

### ⚠️ **WARNING #2: Overflow: hidden on .scene-4-content**
**Location**: `.scene-4-content` (line 750)
**Problem**: `overflow: hidden` may clip children extending beyond boundaries
**Effect**: Could clip arch wrapper, heading, or cards if positioned outside parent
**Recommendation**: Verify no critical elements extend beyond `.scene-4-content` bounds

---

## COMPLETE CSS PROPERTIES AFFECTING VISIBILITY

### All Properties That Could Hide Scene 4 Elements:
1. ✅ `position: fixed` - Correct
2. 🔴 `position: relative` (on `.all-boxes-lit`) - Changes stacking context
3. 🔴 `opacity: 0` (base) - Hides by default, must override with opacity: 1 in .all-boxes-lit
4. 🔴 `opacity: 0.0` (on `.s4-card-content` base) - Hides cards by default
5. 🔴 `pointer-events: none` (base) - Blocks interaction, must override in .active/.all-boxes-lit
6. ⚠️ `overflow: hidden` (on `.scene-4-content`) - Potential clipping
7. ✅ `z-index` values - All correct
8. ✅ `transform` properties - No problematic translations
9. ✅ `background-color` values - Not hiding elements
10. ✅ `display: flex` - Correct, not hiding
11. ✅ `visibility` - Not used (no issues)
12. ✅ `clip-path` - Not used
13. ✅ `mask` - Not used
14. ✅ `filter` - Not problematic

---

## CONCLUSION

**THE SCENE 4 CONTAINER BECOMES INVISIBLE WHEN `.all-boxes-lit` CLASS IS TOGGLED** because:

1. **Missing `opacity: 1`** in `.scene-4-container.all-boxes-lit` CSS rule
   - Falls back to base rule's `opacity: 0`
   - Entire container + all children become invisible

2. **Missing `pointer-events: auto`** in `.scene-4-container.all-boxes-lit` CSS rule
   - Cannot interact with any Scene 4 elements
   - Even if opacity were visible, elements wouldn't respond to clicks

3. **Position context change** from `fixed` to `relative`
   - Affects stacking context creation
   - May interfere with layering hierarchy

These are the **only** CSS visibility issues in Scene 4. All other CSS properties are correctly configured.
