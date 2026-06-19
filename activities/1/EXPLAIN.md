# MWIT Campus Tour — Full Code Explanation

> Section-by-section breakdown of every file in the project.

---

## Table of Contents

1. [HTML — `index.html`](#html--indexhtml)
2. [CSS — `style.css`](#css--stylecss)
3. [JS — `main.js`](#js--mainjs)

---

## HTML — `index.html`

### `<head>` — Metadata & Font Loading

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="MWIT Campus Tour — ผังโรงเรียนมหิดลวิทยานุสรณ์ Campus Map" />
```

| Element | Purpose |
|---|---|
| `charset="UTF-8"` | รองรับภาษาไทยและอักขระพิเศษทั้งหมด |
| `viewport` | Responsive บนมือถือ — ไม่ zoom อัตโนมัติ, width = device width |
| `description` | SEO — ข้อความที่แสดงใน搜索结果 |

```html
<link rel="stylesheet" href="styles/style.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700;800&family=Sarabun:wght@400;500;700&display=swap" rel="stylesheet" />
```

- `preconnect` — สั่ง browser ให้ connect ไปยัง Google Fonts server ก่อน (ลด latency)
- โหลดฟอนต์ **IBM Plex Mono** (ภาษาอังกฤษ + ตัวเลข) และ **Sarabun** (ภาษาไทย)
- `display=swap` — ใช้ fallback font ก่อน โชว์ฟอนต์จริงเมื่อโหลดเสร็จ (ไม่มี invisible text)

### `<header>` — Navigation Bar

```html
<header class="header" id="header">
  <div class="header-inner">
    <div class="header-logo">
      <span class="logo-mark">[ MWIT ]</span>
      <span class="logo-text">Campus Tour</span>
    </div>
    <nav class="header-nav">
      <a class="nav-link" href="#map">แผนผัง</a>
    </nav>
  </div>
</header>
```

- `position: sticky` + `z-index: 50` — ติดอยู่ข้างบนตลอดเวลาเลื่อน
- `.header-inner` — `max-width: 1280px; margin: 0 auto;` — จัดกึ่งกลาง content
- `flex + justify-content: space-between` — logo ด้านซ้าย, nav ด้านขวา

### `<section class="intro">` — Hero Section

```html
<section class="intro" id="about">
  <div class="intro-inner">
    <p class="intro-label">// CAMPUS MAP — MWIT CAMPUS TOUR</p>
    <h1 class="intro-title">
      สำรวจ<span class="accent-green">โรงเรียนมหิดลวิทยานุสรณ์</span>
    </h1>
    <p class="intro-desc">คลิกที่อาคารในแผนผังเพื่อดูข้อมูลภายใน ...</p>
    <button class="btn btn-primary" id="scrollToMap">[ ดูแผนผังทั้งหมด ]</button>
  </div>
</section>
```

- `padding: 6rem 1.5rem 4rem` — ระยะห่างด้านบนมาก (6rem = ~96px) เพื่อความรู้สึกโปร่ง
- `.intro-title` ใช้ `clamp(2rem, 5vw, 3.5rem)` — ขนาดหัวข้อปรับตามหน้าจอ
- `accent-green` ใช้ CSS variable `--c-green` เพื่อเน้นชื่อโรงเรียน
- Button id `scrollToMap` ผูกกับ JS `scrollIntoView({ behavior: "smooth" })`

### `<section class="map-section">` — Interactive Campus Map

```html
<section class="map-section" id="map">
  <div class="map-section-inner">
    <h2 class="section-title">
      <span class="title-accent">//</span>
      CAMPUS MAP
      <span class="title-sub">คลิกอาคารเพื่อดูรายละเอียด</span>
    </h2>
    <div class="map-scroll-wrapper">
      <div class="map-container" id="mapContainer">
        <div class="map-infobar" id="mapInfoBar">
          <span class="infobar-main">Mahidol Wittayanusorn School</span>
        </div>
        <div class="map" id="mapEl">
          <!-- Buildings rendered by JS -->
        </div>
        <div class="map-legend">...</div>
      </div>
    </div>
  </div>
</section>
```

| ID | ใช้โดย | หน้าที่ |
|---|---|---|
| `#mapContainer` | JS hover dimming | รับ class `map-dimming` เวลา hover อาคาร |
| `#mapInfoBar` | JS hover event | แสดงชื่ออาคารที่ hover |
| `#mapEl` | JS `renderBuildings()` | container สำหรับ building divs + labels |

- `.map-scroll-wrapper` — `overflow-x: auto` บนมือถือ (map กว้าง 1120px คงที่)
- `.map-legend` — `position: absolute` วางที่มุมขวาล่างของ map-container

### `<aside class="panel">` — Detail Panel (Slide-up)

```html
<aside class="panel" id="panel">
  <div class="panel-overlay" id="panelOverlay"></div>
  <div class="panel-sheet" id="panelSheet">
    <div class="panel-header">
      <div>
        <h3 class="panel-name" id="panelName">—</h3>
        <p class="panel-sub" id="panelSub">—</p>
      </div>
      <button class="panel-close" id="panelClose">[ X ]</button>
    </div>
    <div class="panel-divider"></div>
    <div class="panel-body" id="panelBody"></div>
  </div>
</aside>
```

- `.panel` — `position: fixed; bottom: 0; z-index: 200` — overlay ทั้งหน้าจอ
- `.panel-sheet` — `transform: translateY(100%)` → ซ่อนอยู่ใต้จอ ปิดด้วย `translateY(0)` เมื่อเปิด
- Transition: `0.3s cubic-bezier(0.22, 1, 0.36, 1)` — ease-out แบบธรรมชาติ
- `pointer-events: none` บน `.panel` → ป้องกันคลิกทะลุตอนปิด
- `.panel-overlay` — background ดำ 70% (`--c-overlay2`) ป้องกัน interaction ข้างหลัง

### `<footer>` & `<script>`

```html
<footer class="footer">...</footer>
<script src="scripts/main.js"></script>
```

- `script` อยู่ท้าย `body` — DOM โหลดเสร็จก่อน JS execute (แต่ยังมี `DOMContentLoaded` guard)
- `flex-direction: column` + `margin-top: auto` บน footer → ดัน footer ลงล่างสุดเสมอ

---

## CSS — `style.css`

### CSS Units Used

| Unit | Relative to | Example | คำนวณที่ 16px |
|---|---|---|---|
| `px` | Nothing (absolute) | `--bw: 3px`, `height: 60px` | 60px = 60px |
| `rem` | Root font-size (`html { font-size: 16px }`) | `padding: 0 1.5rem` | 1.5rem = 24px |
| `em` | Element's own font-size | `letter-spacing: 0.1em` | 0.1 × current font-size |
| `%` | Parent element's dimension | `width: 100%` | 100% of parent |
| `vw` | Viewport width | `5vw` | 5% ของความกว้างจอ |
| `clamp(MIN, PREF, MAX)` | Dynamic range | `clamp(2rem, 5vw, 3.5rem)` | 32px–56px ปรับตาม viewport |

### OKLCH Color Space Explained

Format: `oklch(LIGHTNESS CHROMA HUE / ALPHA)`

| Component | Range | Meaning |
|---|---|---|
| **L** (Lightness) | 0–1 | 0 = black, 1 = white |
| **C** (Chroma) | 0+ | 0 = gray, ยิ่งมากยิ่งสด |
| **H** (Hue) | 0–360 | องศาสีบน color wheel |
| **/ alpha** | 0–1 | ความโปร่งใส (optional) |

### CSS Variables (`:root`)

#### Background & Text

```css
--c-bg: oklch(0.042 0 0);         /* L=0.042 → ดำเกือบสนิท */
--c-text: oklch(0.9 0 0);         /* L=0.9 → เทาอ่อน (text หลัก) */
--c-dim: oklch(0.6 0 0);          /* L=0.6 → เทากลาง (text รอง) */
--c-muted: oklch(0.5 0 0);        /* L=0.5 → เทาเข้ม (muted) */
--c-cat: oklch(0.75 0 0);         /* L=0.75 → เทาอ่อน (category text) */
```

แบบแผน: C=0 ทั้งหมด → เป็นสีเทา (achromatic) / ไม่มี hue → เปลี่ยนเฉพาะความสว่าง

#### Category Colors

```css
--c-green: oklch(0.62 0.072 158);    /* H=158 → เขียว (academic) */
--c-teal: oklch(0.5 0.062 176);      /* H=176 → ฟ้าเขียว (dormitory) */
--c-yellow: oklch(0.85 0.112 99);    /* H=99 → เหลือง (sports) */
--c-coral: oklch(0.68 0.086 21);     /* H=21 → ส้ม-แดง (close hover) */
--c-navy: oklch(0.148 0.02 237);     /* H=237 → น้ำเงิน (panel bg) */
--c-gray: oklch(0.6 0 0);            /* H=0, C=0 → เทา (facilities) */
```

C (chroma) 越高 → สียิ่งสด. H (hue) กำหนดสี:

| Hue (deg) | Color |
|---|---|
| 0 | Red |
| 21 | Orange-red |
| 99 | Yellow |
| 158 | Green |
| 176 | Teal/Cyan |
| 237 | Blue |

#### Shade & Overlay

```css
--c-shade: oklch(0 0 0 / 0.4);       /* L=0, A=0.4 → ดำ 40% */
--c-shade-hv: oklch(0 0 0 / 0.55);   /* ดำ 55% */
--c-shade-ln: oklch(0 0 0 / 0.85);   /* ดำ 85% (legend bg) */
--c-overlay: oklch(0 0 0 / 0.92);    /* ดำ 92% (info bar) */
--c-overlay2: oklch(0 0 0 / 0.7);    /* ดำ 70% (panel overlay) */
```

L=0, C=0 → pure black. ต่างกันที่ alpha.

#### Grid & Effects

```css
--c-wgrid: oklch(1 0 0 / 0.1);       /* ขาว 10% */
--c-wgrid2: oklch(1 0 0 / 0.06);      /* ขาว 6% */
--c-glow-green: oklch(0.62 0.072 158 / 0.35);  /* เขียวเรืองแสง 35% */
```

#### Direct oklch values (in JS + inline CSS)

```
oklch(0.62 0.072 158)        → green stroke (academic)
oklch(0.62 0.072 158 / 0.12) → green fill 12%
oklch(0.5 0.062 176)         → teal stroke (dormitory)
oklch(0.5 0.062 176 / 0.12)  → teal fill 12%
oklch(0.85 0.112 99)         → yellow stroke (sports)
oklch(0.85 0.112 99 / 0.12)  → yellow fill 12%
oklch(0.6 0 0)               → gray stroke (facilities)
oklch(0.6 0 0 / 0.12)        → gray fill 12%
oklch(0.97 0.012 85 / 0.82)  → ตัวเลขอาคาร (cream 82%)
oklch(0.85 0.06 95 / 0.65)   → label สนาม (เหลืองหม่น 65%)
```

### Section-by-Section Layout

#### Reset (`*, *::before, *::after`)

```css
margin: 0;
padding: 0;
box-sizing: border-box;
```

`box-sizing: border-box` ทำให้ `padding` + `border` อยู่ใน `width` (ไม่ล้น)

#### Base (`html`, `body`)

- `html { font-size: 16px; scroll-behavior: smooth; }` — root font-size + smooth anchor scroll
- `body` — flex column, min-height 100vh (footer ดันล่างสุด)

#### Header (`.header`, `.header-inner`)

- `position: sticky; top: 0; z-index: 50;` — ติดข้างบน
- `border-bottom: 3px solid --c-border` — เส้นขอบด้านล่าง
- `max-width: 1280px; margin: 0 auto;` — จัดกึ่งกลาง
- `height: 60px` — ความสูงคงที่ (ง่ายต่อการคำนวณ layout)

#### Intro (`.intro`, `.intro-title`)

- `padding: 6rem 1.5rem 4rem` — 6rem = ~96px top spacing
- `.intro-title` → `font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800;`
- `letter-spacing: -0.02em` — ตัวอักษรชิดกัน (headline effect)

#### Map Container (`.map-scroll-wrapper`, `.map-container`)

- `.map-scroll-wrapper` → `width: 100%; overflow-x: auto` บนมือถือ
- `.map-container` → `width: 1120px; height: 720px` — ขนาดคงที่
- `@media (max-width: 768px)` → เปิด scroll แนวนอน

#### Building Elements (`.bldg` series)

```css
.bldg {
  position: absolute;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  z-index: 2;
}
.bldg:hover {
  transform: translate(-2px, -2px);   /* ยกขึ้นซ้ายบน */
  z-index: 20;
}
```

- `.map-dimming .bldg:not(.bldg-hovered)` → `opacity: 0.2` (dim อาคารอื่น)
- `.bldg-academic.bldg-hovered` → `filter: drop-shadow(0 0 8px var(--c-glow-green))` (glow สี)

#### Info Bar (`.map-infobar`)

```css
position: absolute;
top: 0; left: 0; right: 0;
z-index: 15;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

ซ้อนทับ map ด้านบน `pointer-events: none` เพื่อให้คลิกผ่านไปยัง building ได้

#### Panel (`.panel` series)

```css
.panel { position: fixed; bottom: 0; z-index: 200; pointer-events: none; }
.panel.open { pointer-events: auto; }

.panel-sheet {
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  max-height: 70vh;
  overflow-y: auto;
}
.panel.open .panel-sheet { transform: translateY(0); }
```

- `translateY(100%)` → ซ่อนใต้จอ
- `cubic-bezier(0.22, 1, 0.36, 1)` → custom ease-out (overshoot เล็กน้อย)
- `max-height: 70vh` → ไม่เต็มจอ (เหลือพื้นที่ดูแผนที่)
- `overflow-y: auto` → ถ้า content เยอะ scroll ได้

#### Building List (`.bldg-list-item`)

```css
display: flex;
align-items: center;
gap: 0.6rem;
padding: 0.45rem 0.75rem;
border: 1px solid var(--c-border);
transition: background 0.2s, border-color 0.2s;
```

- จัดเรียง [หมายเลข] [ชื่อไทย] [ชื่ออังกฤษ] [ประเภท] ด้วย flex + gap
- hover → `background` เปลี่ยน + border-color เปลี่ยน

#### Responsive (`@media`)

| Breakpoint | Changes |
|---|---|
| `max-width: 768px` | Intro padding ลด, map horizontal scroll, panel max-height 85vh, header padding ลด |
| `max-width: 480px` | header font-size ลด, logo gap ลด |

---

## JS — `main.js`

### File Structure Overview

```
1. "use strict"                     → Strict mode (ป้องกัน silent errors)
2. const BUILDINGS = [...]          → ข้อมูลอาคารทั้งหมด (17 อาคาร)
3. const LABELS = [...]             → ป้ายสนาม/พื้นที่ (4 จุด)
4. function renderBuildings()       → วาดอาคาร + labels + hover
5. function openPanel(building)     → เปิด panel แสดงข้อมูลชั้น
6. function closePanel()            → ปิด panel
7. function renderBuildingList()    → วาดรายชื่ออาคารทั้งหมด
8. DOMContentLoaded listener        → Init
```

### `"use strict";` (line 1)

เปิด strict mode เพื่อ:
- ป้องกันการใช้ undeclared variable (`x = 5` → error)
- `this` ใน function ธรรมดาเป็น `undefined` (ไม่ใช่ `window`)
- ป้องกัน duplicate parameter name
- ป้องกัน `delete` บน variable/function

### `const BUILDINGS` — Data Array (line 8-303)

Array ของ object อาคาร แต่ละตัวมีโครงสร้าง:

```javascript
{
  id: "bldg1",                // รหัส (ใช้ match /^bldg(\d+)$/ เอาเลข)
  nameTH: "อาคาร...",          // ชื่อไทย (required — ถ้าไม่มี → "undefined" แสดง)
  nameEN: "Bldg 1",            // ชื่ออังกฤษ (required)
  type: "academic",            // "academic" | "dormitory" | "sports" | "facilities"
  subtitle: "อาคารเรียนหลัก",  // (optional — ใช้ใน panel)
  tl: [76.066, 53.7325],       // top-left [x%, y%] (required)
  tr: [82.3562, 53.7325],      // top-right [x%, y%]
  bl: [76.066, 86.9792],       // bottom-left [x%, y%]
  br: [82.3562, 86.9792],      // bottom-right [x%, y%]
  floors: [                    // (optional — ถ้าไม่มี แสดง description)
    { floor: "ชั้น 1", rooms: ["ห้องเรียน (9 ห้อง)"] },
    ...
  ],
  description: "..."           // (optional — fallback ถ้าไม่มี floors)
}
```

### `const LABELS` — Non-building Labels (line 306-311)

```javascript
{ id: "football_field", text: "สนามฟุตบอล", tl: [8.33,16.9], tr: [51.04,16.9], ... }
```

วาดเป็น `.bldg-label` — เส้น dashed สีเหลือง + ตัวอักษรตรงกลาง

### `function renderBuildings()` (line 315-524)

**สร้างทุกอย่างบน map** ทำงานเมื่อ DOM ready:

```
renderBuildings()
├── getElementById("mapEl") — ถ้า null → early return
├── BUILDINGS.forEach() →
│   ├── คำนวณ w, h จาก tl/tr/bl/br
│   ├── createElement("div.bldg.bldg-{type}")
│   ├── วางตำแหน่ง percentage (left/top/width/height)
│   ├── dataset.id = b.id
│   ├── createElementNS("svg") → SVG roof + rect
│   │   ├── rect: fill + stroke + rx=1
│   │   ├── polyline gable (จั่ว) × 2
│   │   ├── line ridge (สันหลังคา)
│   │   └── line slopes × 4 (แนวลาด)
│   ├── createElement("span.bldg-number") เลขอาคาร
│   ├── addEventListener("click") → openPanel(b)
│   └── map.appendChild(el)
├── LABELS.forEach() → สร้าง .bldg-label
└── document.querySelectorAll(".bldg").forEach()
    ├── mouseenter → dimming + highlight + infoBar update
    └── mouseleave → remove highlight + delay(80ms) → undim
```

**Key built-in functions used:**

#### `document.getElementById(id)`
- **param**: `id: string` (ไม่มี `#`)
- **return**: Element | `null`
- **ถ้า element ไม่มี**: return `null` → `.addEventListener()` → **TypeError**
- **Security**: เรามี `if (!map) return;` guard ทุกครั้ง

#### `document.createElement(tagName)`
- **param**: `tagName: string` (e.g., `"div"`, `"span"`)
- **return**: HTMLElement (ยังไม่ผูกกับ DOM)
- ต้อง `appendChild()` ถึงจะแสดงผล

#### `document.createElementNS(namespace, elementName)`
- **ใช้สำหรับ SVG** โดยเฉพาะ — `createElement("rect")` สร้าง HTML element, ไม่ใช่ SVG
- `namespace` = `"http://www.w3.org/2000/svg"`
- **ถ้าใช้ผิด**: SVG จะ render ไม่ได้ (แสดงเป็น unknown element)

#### `element.setAttribute(name, value)`
- ตั้งค่า attribute ใดๆ รวมถึง SVG attributes (`stroke-width`, `rx`)
- ทั้ง param ต้องเป็น string (หรือถูกแปลงเป็น string)
- **Security**: ถ้า name = `"onclick"` → execute เมื่อคลิก (ต้อง whitelist attributes)

#### `element.appendChild(node)`
- ต่อ node เป็นลูกตัวสุดท้าย
- **IMPORTANT**: ถ้า node มี parent อยู่แล้ว → **ย้าย** (ไม่ copy)

#### `element.textContent`
- **SAFE** — auto-escape HTML (ต่างจาก innerHTML)
- ใช้แทน `innerHTML` เสมอเมื่อใส่ user data

#### `element.classList.add() / .remove()`
- add: ไม่เพิ่มซ้ำถ้ามีอยู่แล้ว
- remove: ไม่ error ถ้าไม่มี class นั้น

#### `Array.find(callback)`
- return element แรกที่ callback return `true`
- ถ้าไม่เจอ → `undefined` (ต้อง check `if (b)` ก่อนใช้)

#### `Math.min(a, b)`
- return ค่าน้อยที่สุด
- ถ้าไม่มี argument → `Infinity`

#### `setTimeout(callback, delay)`
- delay ใน ms (80 = 0.08 วินาที)
- ใช้ delay 80ms ใน mouseleave เพื่อป้องกัน flicker

---

### `function openPanel(building)` (line 528-574)

```javascript
openPanel(building)
├── getElementById("panel", "panelName", "panelSub", "panelBody")
│   └── null guard → ถ้าตัวใดตัวหนึ่งหาย → return
├── textContent ใส่ชื่ออาคาร
├── building.floors.forEach() → สร้าง floor-card + room-pill
│   └── ถ้าไม่มี floors → check description → แสดง panel-desc
├── panel.classList.add("open")
└── document.body.style.overflow = "hidden"
```

- `.replaceChildren()` — clear body element (ปลอดภัยกว่า `innerHTML = ""`)
- สร้าง floor structure: `div.floor-card > div.floor-title + div.floor-rooms > span.room-pill × N`

---

### `function closePanel()` (line 576-584)

```javascript
const panel = document.getElementById("panel");
if (!panel) return;           // null guard
panel.classList.remove("open");
document.body.style.overflow = "";
```

- `overflow = ""` — ลบ inline style, revert to CSS default (auto)

---

### `function renderBuildingList()` (line 588-639)

```javascript
renderBuildingList()
├── getElementById("buildingList") — null guard
└── BUILDINGS.forEach()
    ├── กำหนด color + typeLabel ตาม type
    ├── createElement("div.bldg-list-item")
    ├── createElement × 4 (num, name, name-en, type)
    │   └── textContent ใส่ข้อมูล (SAFE — ไม่มี HTML injection)
    └── container.appendChild(item)
```

สร้าง element ด้วย DOM API แทน `innerHTML` — **ป้องกัน XSS** ถ้าข้อมูลมาจาก API

---

### `DOMContentLoaded` Handler (line 643-671)

```javascript
document.addEventListener("DOMContentLoaded", function() {
  renderBuildings();
  renderBuildingList();

  const panel = document.getElementById("panel");
  const closeBtn = document.getElementById("panelClose");
  const overlay = document.getElementById("panelOverlay");
  const scrollBtn = document.getElementById("scrollToMap");

  // null guard — ถ้า closeBtn/overlay/panel หาย → return
  if (!closeBtn || !overlay || !panel) return;

  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closePanel();
    }
  });

  scrollBtn.addEventListener("click", function() {
    document.getElementById("map").scrollIntoView({ behavior: "smooth" });
  });
});
```

**`DOMContentLoaded` vs `window.onload`:**

| Event | Timing |
|---|---|
| `DOMContentLoaded` | HTML parsed, DOM ready → **ก่อน** images/styles โหลดเสร็จ |
| `window.onload` | รอทุกอย่าง (images, fonts, iframes) |

**`scrollIntoView({ behavior: "smooth" })`** — smooth scroll animation ไปยัง target element

**`event.key === "Escape"`** — `KeyboardEvent.key` property, คืนค่า string ของ key:

| Key Pressed | `e.key` |
|---|---|
| Escape | `"Escape"` |
| Enter | `"Enter"` |
| Space | `" "` |
| ArrowUp | `"ArrowUp"` |
| A (no shift) | `"a"` |
| A (shift) | `"A"` |

---

### Security Hardening Applied

| Before | After | Risk |
|---|---|---|
| `var x = ...` (function-scoped) | `const x` / `let x` (block-scoped) | Hoisting bugs |
| `infoBar.innerHTML = '<span>' + name + '</span>'` | `createElement` + `textContent` | **XSS** |
| `item.innerHTML = '<span>' + data + '</span>'` | `createElement` × 4 + `textContent` | **XSS** |
| `bodyEl.innerHTML = ""` | `bodyEl.replaceChildren()` | Safer API |
| No null guard in openPanel | `if (!panel \|\| !nameEl ...) return;` | **TypeError** |
| No null guard in closePanel | `if (!panel) return;` | **TypeError** |
| No null guard in init | `if (!closeBtn \|\| !overlay \|\| !panel) return;` | **TypeError** |

---

## Data Flow Diagram

```
HTML (index.html)
├── #mapEl (empty container)
├── #mapInfoBar (info display)
├── #mapContainer (dimming)
├── #panel .panel (detail panel)
└── #buildingList (building text list)

JS (main.js) on DOMContentLoaded
├── renderBuildings()
│   ├── BUILDINGS.forEach → .bldg divs → append to #mapEl
│   ├── LABELS.forEach → .bldg-label → append to #mapEl
│   └── mouseenter/mouseleave → dim #mapContainer + update #mapInfoBar
├── renderBuildingList()
│   └── BUILDINGS.forEach → .bldg-list-item → append to #buildingList
├── closeBtn → click → closePanel()
├── overlay → click → closePanel()
├── Escape key → closePanel()
└── scrollBtn → click → #map.scrollIntoView()

openPanel(building)
├── .panel.open → slide-up animation (CSS transition)
├── building.name → #panelName
├── building.floors → floor-card → #panelBody
└── body overflow hidden

closePanel()
├── .panel remove open → slide-down
└── body overflow restore
```
