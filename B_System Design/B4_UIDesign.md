# B4 – UI Design System: Ngôn Ngữ Thiết Kế

> **Hệ thống**: Teacher Competency Growth OS
> **Nguồn**: Dựa trên [conan1.com/styles](https://conan1.com/styles)
> **Stack**: TailwindCSS v4 + CSS Variables | Font: Arial | Màu chủ đạo: Cam đất (Burnt Orange)

---

## 1. DESIGN TOKENS – CSS Variables (từ conan1.com)

```css
:root {
  /* === CORE SEMANTIC COLORS === */
  --background:         #ffffff;
  --foreground:         #111111;
  --card:               #ffffff;
  --card-foreground:    #111111;
  --popover:            #ffffff;
  --popover-foreground: #111111;

  /* Primary – Burnt Orange (cam đất) */
  --primary:            #cc4e2d;
  --primary-foreground: #ffffff;

  /* Secondary – Light Grey */
  --secondary:          #f2f2f2;
  --secondary-foreground: #111111;

  /* Muted */
  --muted:              #f2f2f2;
  --muted-foreground:   #666666;

  /* Accent – Warm Cream */
  --accent:             #fff7ed;
  --accent-foreground:  #a83d22;

  /* System */
  --destructive:        #dc2626;
  --border:             #e7e5e4;
  --input:              #d6d3d1;
  --ring:               #cc4e2d;
}
```

---

## 2. COLOR PALETTE

### Core Brand Colors
| Token | Hex | Tên gọi | Dùng ở đâu |
|-------|-----|---------|-----------|
| `--primary` | `#cc4e2d` | Burnt Orange | CTA buttons, links, highlights, eyebrow |
| `--accent` | `#fff7ed` | Warm Cream | Card backgrounds, tooltips nhẹ |
| `--accent-foreground` | `#a83d22` | Dark Orange | Text trên accent background |
| `--background` | `#ffffff` | Pure White | Page background |
| `--foreground` | `#111111` | Near Black | Body text chính |
| `--muted` | `#f2f2f2` | Light Grey | Input bg, disabled states |
| `--muted-foreground` | `#666666` | Mid Grey | Placeholder, secondary text |
| `--border` | `#e7e5e4` | Warm Grey Border | Card borders, dividers |
| `--destructive` | `#dc2626` | Red | Error states |

### Neutral Scale (Grey tones)
| Token | OKLCH | Dùng cho |
|-------|-------|---------|
| `--color-neutral-50` | `oklch(98.5% 0 none)` | Page background nhẹ |
| `--color-neutral-100` | `oklch(97% 0 none)` | Dividers, hover backgrounds |
| `--color-neutral-200` | `oklch(92.2% 0 none)` | Borders nhẹ |
| `--color-neutral-400` | `oklch(70.8% 0 none)` | Icons, secondary labels |
| `--color-neutral-600` | `oklch(43.9% 0 none)` | Secondary text |
| `--color-neutral-800` | `oklch(26.9% 0 none)` | Dark text |
| `--color-neutral-900` | `oklch(20.5% 0 none)` | Headings |
| `--color-neutral-950` | `oklch(14.5% 0 none)` | Near black, max contrast |

### Stage Colors (riêng cho Building 21 Stages)
| Stage | Màu | Ý nghĩa tâm lý |
|-------|-----|----------------|
| Stage 1 | `--color-neutral-400` (grey) | Đang bắt đầu – neutral |
| Stage 2 | Derived from `--accent` | Đang phát triển |
| Stage 3 | `#d95a36` (lighter orange) | Tiến bộ rõ ràng |
| Stage 4 | `--primary` `#cc4e2d` | Thành thạo – brand color |

---

## 3. TYPOGRAPHY

```css
/* Font duy nhất: Arial (system font, không cần import) */
--default-font-family: Arial;
font-family: Arial;
font-size: 16px;  /* base */
-webkit-font-smoothing: antialiased;
```

### Type Scale
| Token | Value | Line Height | Dùng cho |
|-------|-------|------------|---------|
| `text-xs` | 0.75rem (12px) | auto | Labels, badges, captions |
| `text-sm` | 0.875rem (14px) | 1.25/0.875 | Body secondary, UI |
| `text-base` | 1rem (16px) | 1.5/1 | Body chính |
| `text-lg` | 1.125rem (18px) | 1.75/1.125 | Subheadings |
| `text-xl` | 1.25rem (20px) | 1.75/1.25 | Section subtitles |
| `text-2xl` | 1.5rem (24px) | 2/1.5 | Card titles |
| `text-3xl` | 1.875rem (30px) | 2.25/1.875 | Page section titles |
| `text-4xl` | 2.25rem (36px) | 2.5/2.25 | Major headings |
| `text-5xl` | 3rem (48px) | 1 | Hero titles (mobile) |
| `text-6xl` | 3.75rem (60px) | 1 | Hero titles (desktop) |

### Font Weights
```css
--font-weight-normal:    400;
--font-weight-medium:    500;
--font-weight-semibold:  600;
--font-weight-bold:      700;
--font-weight-extrabold: 800;
--font-weight-black:     900;
```

### Letter Spacing (từ eyebrow class)
```css
.eyebrow {
  color: var(--primary);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.2;
}
```
→ Dùng cho labels "TC.1", "Stage 3", "Evidence", "Đang focus"

### Section Title
```css
.section-title {
  letter-spacing: -0.035em;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 900;
  line-height: 1.08;
}
```

---

## 4. SPACING SYSTEM

```css
/* Base: 0.25rem = 4px */
--spacing: 0.25rem;

/* Common values */
gap-1  → 4px    gap-2  → 8px    gap-3  → 12px
gap-4  → 16px   gap-5  → 20px   gap-6  → 24px
gap-8  → 32px   gap-10 → 40px
p-3    → 12px   p-4    → 16px   p-5    → 20px
p-6    → 24px   p-8    → 32px   p-10   → 40px
```

---

## 5. BORDER RADIUS

```css
.rounded-md  → 6px    /* Buttons nhỏ, badges */
.rounded-lg  → 8px    /* Cards, inputs (.surface-card) */
.rounded-xl  → 8px    /* Aliases */
.rounded-2xl → 1rem   /* Large panels */
.rounded-full → 999px /* Pills, avatars, orbs */
```

---

## 6. SHADOWS

```css
/* Shadow nhẹ – Card default */
shadow-sm: 0 1px 3px #0000001a, 0 1px 2px -1px #0000001a

/* Shadow vừa – Card hover */
shadow: 0 1px 3px #0000001a, 0 1px 2px -1px #0000001a

/* Shadow lớn – Modals, Interactive visuals */
shadow-xl: 0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a

/* Branded shadow (primary color glow) */
shadow-[0_18px_50px_rgba(204,78,45,0.08)]   /* CTA cards */
shadow-[0_24px_70px_rgba(17,17,17,0.08)]    /* Hero visuals */
```

---

## 7. COMPONENT STYLES

### 7.1 Surface Card
```css
.surface-card {
  border: 1px solid var(--border);    /* #e7e5e4 */
  background: var(--card);            /* #ffffff */
  border-radius: 8px;
}
```

### 7.2 Eyebrow Label
```css
/* Dùng cho: "TC.5 · Stage 3 · 7 Indicators" */
.eyebrow {
  color: var(--primary);       /* #cc4e2d */
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 800;
}
```

### 7.3 Primary Button
```css
background: var(--primary);           /* #cc4e2d */
color: var(--primary-foreground);     /* #fff */
border-radius: 8px;
padding: 10px 24px;
font-weight: 600;
font-size: 14px;

/* Hover */
background: color-mix(in oklab, var(--primary) 80%, transparent);
translate: 0 1px;  /* active press */
```

### 7.4 Secondary Button
```css
background: var(--secondary);          /* #f2f2f2 */
color: var(--secondary-foreground);    /* #111 */
border: 1px solid var(--border);
border-radius: 8px;
```

### 7.5 Interactive Visual (Hero image style từ conan1)
```css
/* Card với 3D tilt effect – dùng cho Dashboard hero */
.interactive-visual {
  background: #171717;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  aspect-ratio: 16/9;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(0,0,0,0.16);
}
```

### 7.6 Accent Panel (Warm Cream bg)
```css
/* Dùng cho: Rubric panels, tooltips, highlight boxes */
background: var(--accent);              /* #fff7ed */
border: 1px solid rgba(204,78,45,0.2);
border-radius: 8px;
color: var(--accent-foreground);        /* #a83d22 */
```

### 7.7 Page Shell (Max width container)
```css
.page-shell {
  width: min(100% - 2rem, 1280px);
  margin-inline: auto;
}
```

---

## 8. SELECTION & FOCUS

```css
/* Text selection */
::selection {
  color: #7c2d12;
  background: #fed7aa;   /* Warm orange highlight */
}

/* Focus ring – primary color */
:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--ring) 45%, transparent);
  outline-offset: 3px;
}
```

---

## 9. TRANSITIONS & ANIMATIONS

```css
/* Base transition */
--default-transition-duration: 0.15s;
--default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Component animations (từ interactive-visual) */
@keyframes visual-float {
  0%, 100% { margin-top: 0 }
  50%       { margin-top: -12px }
}

@keyframes visual-drift {
  0%, 100% { margin-top: 0 }
  50%       { margin-top: 10px }
}
```

**Áp dụng cho dự án:**
- Stage badge chọn → `transition: background 0.15s ease`
- Card hover → `box-shadow` transition
- Evidence saved → brief `scale(1.1)` confirm
- Radar chart render → `animation: fadeIn 0.3s ease`

---

## 10. SEMANTIC MAPPING – JTBD → Color

| JTBD Context | Conan1 Token | Ý nghĩa |
|-------------|-------------|---------|
| Next Action CTA | `--primary` (#cc4e2d) | Hành động quan trọng nhất |
| Evidence confirmed | Derived orange lighter | Bằng chứng được ghi nhận |
| Rubric / Framework text | `--accent` bg + dark text | Thông tin tham khảo |
| Chưa đánh giá / Warning | `--destructive` tinted | Cần chú ý |
| Stage 4 (Expert) | `--primary` full opacity | Đỉnh cao – brand color |
| Background neutral | `--muted` / `--color-neutral-50` | Rest state |

---

## 11. RESPONSIVE BREAKPOINTS

```css
sm: min-width 40rem (640px)   → 2-column layouts
md: min-width 48rem (768px)   → 3-column, side-by-side
lg: min-width 64rem (1024px)  → Full desktop layout
xl: min-width 80rem (1280px)  → Wide layout
```

**Mobile-first rules:**
- Rubric panel: carousel swipe trên mobile, 4-column grid trên desktop
- CTA buttons: `min-height: 44px` (touch target)
- Font size: `max(14px, 1em)` cho tất cả interactive elements

---

## 12. AUDIT QUESTIONS

1. Mọi CTA button có dùng `--primary` (#cc4e2d) không? Không hardcode hex.
2. Font có phải **Arial** không? Không dùng Google Fonts (conan1 dùng system font).
3. Card border có đúng `--border` (#e7e5e4) không?
4. Focus ring có là `--ring` (= primary color) không?
5. Text selection có đúng màu warm orange (`#fed7aa` bg) không?

---
*→ Source: [conan1.com/styles](https://conan1.com/styles) | Tham chiếu: B3_WebArchitecture.md (CSS structure) | A4_ContentStandards.md (micro-copy)*
