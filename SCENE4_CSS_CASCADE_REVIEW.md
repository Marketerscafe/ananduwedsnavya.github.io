# Scene 4 Complete CSS Cascade Review

**Date**: 2026-06-04  
**Review Type**: Exhaustive CSS cascade analysis for `.scene-4-container` all-boxes-lit state

---

## 1. COMPLETE CSS RULE BREAKDOWN

### Base `.scene-4-container` (Line 641-656)
```css
.scene-4-container {
  position: fixed;
  inset: 0;                    /* top: 0; right: 0; bottom: 0; left: 0; */
  width: 100%;
  height: 100%;
  height: 100dvh;              /* Overrides previous height */
  background-color: #F5F2EB;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), 
              background-image 3s ease-out, 
              background-color 3s ease-out;
  will-change: opacity;
}
```

### `.scene-4-container.active` (Line 658-662)
```css
.scene-4-container.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 1000;  /* Keep high z-index when active */
}
```

### `.scene-4-container.all-boxes-lit` (Line 665-674)
```css
.scene-4-container.all-boxes-lit {
  opacity: 1;
  pointer-events: auto;
  background-color: rgba(10, 8, 5, 0.3);    /* Semi-transparent dark overlay */
  background-image: none;
  background-size: cover, cover;
  background-position: center, center;
  background-attachment: fixed;
  z-index: 1000;  /* Maintain very high z-index */
}
```

### Media Query Override (Line 745-751)
**Only applies when: `max-width: 768px` AND `.all-boxes-lit` state**
```css
@media (max-width: 768px) {
  .scene-4-container.all-boxes-lit {
    background-attachment: scroll;    /* Changes from 'fixed' to 'scroll' */
    background-size: cover, cover;
    background-position: center, center;
  }
}
```

---

## 2. COMPLETE CASCADE TABLE

### Properties: opacity, pointer-events, position, z-index, display, overflow, visibility, width, height, background-color, background-image

| Property | Base Value | .active Value | .all-boxes-lit Value | Media Query (≤768px) | Cascade Correct? | Notes |
|----------|-----------|---------------|----------------------|----------------------|------------------|-------|
| **position** | `fixed` | Inherited: `fixed` | Inherited: `fixed` | None | ✅ YES | Fixed positioning maintained throughout |
| **inset** | `0` (top/right/bottom/left) | Inherited: `0` | Inherited: `0` | None | ✅ YES | Locks to viewport edges properly |
| **top** | `0` (from inset) | Inherited: `0` | Inherited: `0` | None | ✅ YES | Locks to viewport top |
| **left** | `0` (from inset) | Inherited: `0` | Inherited: `0` | None | ✅ YES | Locks to viewport left |
| **width** | `100%` | Inherited: `100%` | Inherited: `100%` | None | ✅ YES | Fills viewport properly |
| **height** | `100dvh` (last wins) | Inherited: `100dvh` | Inherited: `100dvh` | None | ✅ YES | Dynamic viewport height correct |
| **display** | `flex` | Inherited: `flex` | Inherited: `flex` | None | ✅ YES | Flex layout maintained |
| **justify-content** | `center` | Inherited: `center` | Inherited: `center` | None | ✅ YES | Horizontal centering works |
| **align-items** | `center` | Inherited: `center` | Inherited: `center` | None | ✅ YES | Vertical centering works |
| **z-index** | `1000` | `1000` (explicit) | `1000` (explicit) | None | ✅ YES | Consistent high z-index |
| **opacity** | `0` | `1` ✅ | `1` ✅ | None | ✅ YES | **Visible in all-boxes-lit state** |
| **pointer-events** | `none` | `auto` ✅ | `auto` ✅ | None | ✅ YES | **Interactive in all-boxes-lit state** |
| **background-color** | `#F5F2EB` (ivory) | Inherited: `#F5F2EB` | `rgba(10, 8, 5, 0.3)` ✅ | None | ✅ YES | **Darkens to translucent overlay** |
| **background-image** | Not set (none) | Inherited: none | `none` (explicit) | None | ✅ YES | No background image interference |
| **background-size** | Not set | Inherited: none | `cover, cover` | `cover, cover` | ✅ YES | Sizing maintained |
| **background-position** | Not set | Inherited: none | `center, center` | `center, center` | ✅ YES | Positioning maintained |
| **background-attachment** | Not set | Inherited: none | `fixed` | `scroll` (≤768px) | ✅ YES | **Mobile-specific optimization applied** |
| **overflow** | Not set (visible) | Inherited: visible | Inherited: visible | None | ✅ YES | Content not clipped |
| **visibility** | Not set (visible) | Inherited: visible | Inherited: visible | None | ✅ YES | Container not hidden |
| **transition** | `opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), background-image 3s ease-out, background-color 3s ease-out` | Inherited | Inherited | None | ✅ YES | Smooth state transitions |
| **will-change** | `opacity` | Inherited | Inherited | None | ✅ YES | GPU acceleration enabled |

---

## 3. SPECIFICITY ANALYSIS

### Specificity Calculation (CSS Specificity = a,b,c where a=IDs, b=classes/pseudo-classes, c=elements)

| Selector | Specificity | Calculation | Notes |
|----------|-------------|-------------|-------|
| `.scene-4-container` | 0,1,0 | 1 class | Base rule |
| `.scene-4-container.active` | 0,2,0 | 1 class + 1 pseudo-class equivalent | **Higher than base** ✅ |
| `.scene-4-container.all-boxes-lit` | 0,2,0 | 1 class + 1 pseudo-class equivalent | **Equal to .active** ✅ |
| `@media (max-width: 768px) .scene-4-container.all-boxes-lit` | 0,2,0 | Same specificity in media query | Media queries don't affect specificity |

**Cascade Order Assessment**:
- ✅ `.scene-4-container.all-boxes-lit` comes AFTER `.scene-4-container.active` (line 665 vs 658)
- ✅ Specificity is equal, so **source order determines winner**
- ✅ **all-boxes-lit properties will override .active properties** (correct behavior)
- ✅ Media query properties override base all-boxes-lit only on mobile

---

## 4. IMPORTANT FLAGS & DECLARATIONS

**Search for `!important`**: ❌ NONE FOUND

✅ No `!important` flags blocking style application
✅ Pure cascade-based specificity resolution (clean CSS)

---

## 5. CHILD ELEMENT STYLING IN all-boxes-lit STATE

### Child Selectors That Affect Visibility

| Selector | Properties | Effect | Correctly Applied? |
|----------|-----------|--------|-------------------|
| `.scene-4-container.all-boxes-lit .underwater-waves-video` | `opacity: 0.75; pointer-events: none;` | Video becomes visible behind | ✅ YES |
| `.scene-4-container.all-boxes-lit .underwater-waves-overlay` | `opacity: 1; animation: loop-seam-hide 4s...` | Overlay animates and shows | ✅ YES |
| `.scene-4-container.all-boxes-lit #s4-card-1, #s4-card-2, #s4-card-3` | `opacity: 1;` | Cards fully visible | ✅ YES |
| `.scene-4-container.all-boxes-lit .s4-card-content` | `background: rgba(255,255,255,0.65); border-color: rgba(255,255,255,0.85); box-shadow: 0 40px 80px...` | Bright glass morphism effect | ✅ YES |
| `.scene-4-container.all-boxes-lit .s4-card-content::before` | `opacity: 1; background: radial-gradient(...)` | Shine effect visible | ✅ YES |
| `.scene-4-container.all-boxes-lit #butterfly-canvas` | `filter: drop-shadow(0 0 20px rgba(255,255,255,0.1))` | Butterfly highlighted | ✅ YES |

---

## 6. VISUAL HIDING PROPERTIES CHECK

### Properties That Could Hide Container

| Property | Value | Could Hide? | Assessment |
|----------|-------|-------------|------------|
| **opacity** | Base: `0` → all-boxes-lit: `1` | ⚠️ Base hides | ✅ **Correctly shown in all-boxes-lit** |
| **visibility** | Not set (inherits `visible`) | ❌ No | ✅ OK |
| **display** | `flex` | ❌ No | ✅ OK |
| **position** | `fixed` | ❌ No | ✅ OK (properly positioned) |
| **pointer-events** | Base: `none` → all-boxes-lit: `auto` | ⚠️ Base blocks clicks | ✅ **Correctly enabled in all-boxes-lit** |
| **clip-path** | Not set | ❌ No | ✅ OK |
| **clip** | Not set | ❌ No | ✅ OK |
| **mask** | Not set | ❌ No | ✅ OK |
| **mask-image** | Not set | ❌ No | ✅ OK |
| **overflow** | Not set (default `visible`) | ❌ No | ✅ OK |
| **z-index** | `1000` | ❌ No (very high) | ✅ OK |
| **width / height** | `100% / 100dvh` | ❌ No (fills viewport) | ✅ OK |
| **background-color** | Changes to dark overlay | ❌ No (adds visual, doesn't hide) | ✅ OK |
| **transform** | Not set | ❌ No | ✅ OK |
| **filter** | Not set on container (only on children) | ❌ No | ✅ OK |
| **backdropFilter** | Not set | ❌ No | ✅ OK |

---

## 7. TRANSITION SMOOTHNESS

```css
transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), 
            background-image 3s ease-out, 
            background-color 3s ease-out;
```

| Transitioned Property | Duration | Timing Function | Behavior |
|----------------------|----------|-----------------|----------|
| **opacity** | 0.8s | `cubic-bezier(0.25, 1, 0.5, 1)` | Smooth fade-in to all-boxes-lit |
| **background-image** | 3s | `ease-out` | 3-second background transition |
| **background-color** | 3s | `ease-out` | 3-second color transition to dark overlay |

✅ All critical properties are transitioned smoothly

---

## 8. COMPLETE STATE MATRIX

### What Happens at Each State

| State | Condition | Visibility | Interactivity | Background | Notes |
|-------|-----------|-----------|---|---|---|
| **Initial/Hidden** | No classes | `opacity: 0` ❌ HIDDEN | `pointer-events: none` ❌ BLOCKED | `#F5F2EB` (ivory) | Container not visible |
| **Active** | `.active` class | `opacity: 1` ✅ VISIBLE | `pointer-events: auto` ✅ ENABLED | `#F5F2EB` (ivory) | Standard display mode |
| **All-Boxes-Lit** | `.active.all-boxes-lit` | `opacity: 1` ✅ VISIBLE | `pointer-events: auto` ✅ ENABLED | `rgba(10,8,5,0.3)` (dark overlay) | **Enhanced visual mode** |
| **All-Boxes-Lit (Mobile)** | `.active.all-boxes-lit` on ≤768px | `opacity: 1` ✅ VISIBLE | `pointer-events: auto` ✅ ENABLED | `rgba(10,8,5,0.3)` + `background-attachment: scroll` | Mobile optimization applied |

---

## 9. CASCADE ORDER VERIFICATION

```
📍 Line 641:   .scene-4-container { ... } ←── BASE RULE
📍 Line 658:   .scene-4-container.active { ... } ←── STATE #1
📍 Line 665:   .scene-4-container.all-boxes-lit { ... } ←── STATE #2 (LATER, wins over .active)
📍 Line 745:   @media (max-width: 768px) .scene-4-container.all-boxes-lit { ... } ←── MOBILE OVERRIDE
```

✅ **Cascade is CORRECT**:
- `.all-boxes-lit` comes AFTER `.active` in source
- Equal specificity means source order wins
- Media query comes last (wins only on mobile)

---

## 10. CRITICAL FINDINGS

### ✅ CORRECT PROPERTIES

1. **opacity: 1** — Container is fully visible in all-boxes-lit ✅
2. **pointer-events: auto** — Container is interactive ✅
3. **position: fixed** — Stays fixed to viewport ✅
4. **z-index: 1000** — Stays above other elements ✅
5. **background-color: rgba(10, 8, 5, 0.3)** — Darkens to create overlay effect ✅
6. **Cascade order** — all-boxes-lit comes after .active, so it wins ✅
7. **No !important flags** — Clean cascade-based resolution ✅
8. **Media query mobile optimization** — background-attachment adapts to scroll ✅
9. **Child elements styled correctly** — Cards, overlay, and butterfly all have proper visibility ✅
10. **Transitions smooth** — All visual changes are animated ✅

### ⚠️ POTENTIAL MINOR OBSERVATIONS

1. **Background sizing**: `background-size: cover, cover` uses double specification (comma-separated) but only one background-image is set (`none`). This is harmless but redundant.

2. **Media query mobile adjustment**: On mobile, `background-attachment` switches from `fixed` to `scroll`. This is intentional for performance but verify if this causes visual scrolling issues.

---

## SUMMARY TABLE: Full Property Cascade

| Property | Base | .active | .all-boxes-lit | Mobile Override | ✓ Correct? |
|----------|------|---------|---|---|---|
| position | fixed | inherited | inherited | none | ✅ YES |
| opacity | 0 | 1 | 1 | none | ✅ YES |
| pointer-events | none | auto | auto | none | ✅ YES |
| z-index | 1000 | 1000 | 1000 | none | ✅ YES |
| display | flex | inherited | inherited | none | ✅ YES |
| background-color | #F5F2EB | inherited | rgba(10,8,5,0.3) | none | ✅ YES |
| background-image | none | inherited | none | none | ✅ YES |
| background-attachment | none | inherited | fixed | scroll | ✅ YES |
| width | 100% | inherited | inherited | none | ✅ YES |
| height | 100dvh | inherited | inherited | none | ✅ YES |
| overflow | visible | inherited | inherited | none | ✅ YES |
| visibility | visible | inherited | inherited | none | ✅ YES |

---

## CONCLUSION

### Overall Assessment: ✅ **EXCELLENT**

The `.scene-4-container` CSS cascade for the `all-boxes-lit` state is **well-structured and correct**:

- ✅ Container is visible (opacity: 1)
- ✅ Container is interactive (pointer-events: auto)  
- ✅ Container stays fixed to viewport
- ✅ Container maintains high z-index
- ✅ Container darkens with correct overlay color
- ✅ All child elements are properly styled
- ✅ Cascade order is correct (all-boxes-lit after active)
- ✅ No conflicting !important flags
- ✅ Media queries provide mobile optimization
- ✅ Smooth transitions applied

**No critical issues found. The styling is production-ready.**

---

**Generated**: 2026-06-04  
**Last CSS Sync**: style.css (lines 641-751)
