# The Miners — About us · demo

Rebuilt against Figma frame **`5422-41`** (1512 wide). Open `index.html` — no build,
no dependencies, runs from the file system. Desktop and mobile in one responsive build.

---

## What the structure follows

* **Full-bleed sections.** Nothing is inset by the page gutter any more — every section
  spans the full width and only its *content* sits inside the 80 px gutter. No side rails.
* **40 px overlap.** Each section carries `border-radius: 40px 40px 0 0` and a `-40px`
  top margin, so it always rides 40 px over the one above it — including over the blue
  numbers block, whatever state that block is in.
* **Header** sits straight on the hero: mark, `Eng / Eur`, nav, cart and account. No bar,
  no underlines, no rules.
* **Hero** is the photo and the display line only — no subtitle.
* **Our story** is a plain white section, not a grey card.

## The numbers block, two states

State 1 is a full-height blue panel: the figures sit near the top, the labels are pinned to
the bottom, the columns are **sized to their own figure** (a wide number gets a wide column)
and the leftover width is shared out evenly between them. The type is auto-fitted so the row
always fills the measure — which is what keeps it looking like the frame at any width.

Scrolling does not shrink it in the middle of the screen. The panel is **pinned to the top**
and the white section below rises and squeezes it: its height is always
`next section's top + 40`, clamped. When it reaches state 2 — equal columns, figure over
label, short dividers — it stops shrinking and scrolls away like any other section.

## The three timeline variants

The pill bottom-right jumps between them; it and the black variant tags are demo scaffolding.

* **A — revolver cards.** Two cards on screen at all times. On each step the whole rank moves
  left: the left card slides left *and down* until it is gone, the right card takes its place,
  and the next card rises from below and to the right into the right-hand slot. Pure
  translation, eased in and out, cropped by the frame. Card layout is the frame's: title and
  `Year 20XX` sitting on the same bottom line, one photo, two text columns under hairlines.
* **B — big year.** The year is centred in its own 1176 × 548 stage and two photos land in
  different corners for every year, set far enough out that they only graze the digits. Below
  the stage: title bottom-left, two text columns, each hairline drawing itself out to the right.
  The year is a four-reel odometer — rolls down going forward, up going back. Each reel is
  `.68em` wide because the widest digit in Neue Haas Black advances `.674em`; anything tighter
  clips the glyph and the gap reads as a neighbouring box cutting into it.
* **C — scroll list.** The scrollbar is live: the thumb tracks the reading line, the active year
  lights up, and the bar is draggable and keyboard-operable.

## Sections 02 → 07

Rebuilt from the current frame, not the earlier one: heading left and a short paragraph right
in every section header; `What sets us apart` as two asymmetric rows; `Awards` as five centred
badges on light — a six-track grid so three sit on the top row and two centre underneath,
whatever the viewport; `Press` as six pull quotes on blue, the giant quote mark painted flat
into the background behind everything and the heading exactly one row-gap above the first line
of quotes; `Collaborations` as a 3 × 3 logo grid with hairlines, not a marquee.

---

## Palette

Only `#F7F7F7` is available as white — `#FFFFFF`, `#F5F5F5` and the grey `#BFBFBF` are not
used anywhere on this page. Every surface, every knocked-out text colour and every white
alpha resolves to `#F7F7F7`. The pale quote mark is a flat `#4FAAEA`, the blue mixed 16 %
toward that white, rather than a white overlay.

## Eight words to a line

Body copy never runs past eight words on a line. A width cap in `ch` only gets you close — a
run of short words still fits several more — so `app.js` measures the rendered lines with a
Range and tightens the measure of any paragraph that breaks the rule, down to 82 % of its
natural width at most. Paragraphs that sit side by side are then levelled to a single width,
so a tightened column never ends up narrower than the one next to it. It re-runs on resize,
once the webfont lands, and on every year swapped into variant B. The limit is one constant —
`MAX_WORDS` at the top of that block — if you want to move it again. Verified at 1512, 1820
and phone widths: zero lines over eight words.

## Type scale

Taken straight from the Figma text styles, not measured:

```
Display 144/90   H1 96/90   H2 64/90   Title 48/90
Large Subtitle 36/90   Subtitle 20/90   Button 16/90
Body 16/auto   Caption 10/120       letter-spacing 0 throughout
```

They live as `--fs-display` … `--fs-caption` in `styles.css` and scale down with `clamp()`
against the 1512 frame.

## Still needs your confirmation

| | |
|---|---|
| **The blue** | `--blue: #2F9BE8` was matched by eye against the frame — within a point or two, not exact. One dev-mode copy settles it. |
| **Three award lines** | The bodies are written to fill the slot — `Twenty-five rooms on the continent`, `Picked by Monocle…`, `First place at the Prague Roasters Competition`. Swap in the real results. |
| **Two Europe's 25 tiles** | Awards 3 and 4 carry the same title under different marks (Europe's 25 and Monocle). One of them wants its own name. |
| **Forbes quote** | `Miners neskrývají světové ambice` moved to Standart as you asked, so Forbes now carries its other headline, `The Miners dobývají Prahu a míří za hranice`. Say the word if you want a different line there. |
| **Body copy** | The short paragraph in each section header is mine, written to fill the slot — rewrite freely. |
| **Typos** | `WHERE IT ALL BEGUN` → *began*, `MORE THEN COFFEE SHOP` → *more than a coffee shop*, `ACROSS EUROPPE` → *across Europe*. |

## Files

```
index.html
Assets/css/styles.css
Assets/js/data.js     the eight years, the pull quotes, the awards, the collaboration marks
Assets/js/app.js      header · reveals · numbers squeeze · variants A/B/C
Assets/marks/         award badges and press logos (from your SVGs)
Assets/img/ Assets/logos/ Assets/fonts/ Assets/svg/
Assets/Cards Animaiton Reference.mp4
```
