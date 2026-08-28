# Haus Labs Discovery Set

A pixel-faithful prototype of the Haus Labs Foundation & Brush Discovery Set page, with a desktop **Motion desk** for tuning animation.

- Live: [https://anderslinders.github.io/HLDS/](https://anderslinders.github.io/HLDS/)
- Local: `npm install` then `npm run dev` → [http://localhost:5173/](http://localhost:5173/)

On viewports **901px and wider**, the page sits in a 393×852 canvas with the Motion desk beside it. Below 900px, the desk is hidden and the page fills the screen.

**1.00× is the designed timing.** Drag a dial up to raise the value, down to lower it. Settings persist in the browser.

## Dials

Higher values play **faster**, except **Stagger** (more gap between items) and **Parallax** (stronger scroll shift).

### Speed

**Range:** 0.25× – 4.00×

Master clock for the whole page. It scales reveal duration, UI duration, stagger delays, and image zoom together. Turn it up to preview a snappier site; turn it down to inspect easing in slow motion.

### Reveal

**Range:** 0.25× – 4.00×

How quickly content **fades and slides in** as it enters the viewport (hero copy, product blocks, how-to steps, ingredients, FAQs). Also controls the subtle zoom-out on product photos.

Speed and Reveal stack: duration is `1s ÷ Speed ÷ Reveal`.

### Stagger

**Range:** 0.00× – 3.00×

The pause **between** sequenced hero lines (eyebrow → title → body → perks → CTA).

- **0.00×** — they all start at once
- **1.00×** — designed cascade
- **Higher** — each line waits longer after the last (the entrance takes more time)

Unlike Speed, a higher Stagger does **not** play faster.

### UI

**Range:** 0.25× – 4.00×

Chrome and controls only: sticky header shadow, split-CTA hover, FAQ accordion, menu/search drawers. Page-scroll reveals are unchanged.

### Parallax

**Range:** 0.00× – 2.50×

How much the **hero gift box** and **arnica** image shift as you scroll.

- **0.00×** — locked; no depth
- **1.00×** — designed amount
- **Higher** — more movement

## Buttons

| Button | What it does |
| --- | --- |
| **Replay** | Scrolls to the top and replays enter animations |
| **Default** | Sets every dial back to 1.00× |
| **Hide** | Collapses the desk so you can view the page alone |
