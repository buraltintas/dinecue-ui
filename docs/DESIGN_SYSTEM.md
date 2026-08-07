# dinecue Design System

## The Brand Name

The product is always written **dinecue** — lowercase, everywhere: copy, metadata, structured data, the wordmark, and at the start of a sentence. Never `DineCue`.

This is also why micro-labels are set **lowercase** rather than uppercase. Turkish casing turns `dinecue` into `DİNECUE`, so an uppercase label would break the brand every time it appeared in a Turkish string.

The slogan follows the wordmark: **eat by mood.** — lowercase, in every language, since it is a brand object rather than content. Section headings stay in sentence case, because they are content. Brand voice is lowercase; content voice is not.

The two full stops are a matched pair and the only place these two accents meet: the wordmark's stop is **amber** (the invitation), the slogan's stop is **sage** (the decision, settled).

## Visual Direction

dinecue is dark-first, premium, warm futuristic, cinematic, trustworthy, and food-aware. The interface should feel luxurious without becoming heavy or theatrical.

The system is token-based. Colours, type sizes, radii and section rhythm all live in `tailwind.config.ts`; `app/globals.css` holds the small set of utilities that Tailwind cannot express (`.container-page`, `.eyebrow`, `.glass`, `.rule-fade`, `.plate-ring`). Do not reintroduce ad-hoc arbitrary values such as `rounded-[1.35rem]` — extend the scale instead.

## Colors

Grounds: `night` `#100E0C` is the dominant one — a warm near-black that reads as a dim dining room rather than a developer dark theme. `void` `#08080A` is the deepest band, `ember` `#1A1613` the warm panel, `charcoal` `#151412` a mid step. `graphite` `#0D0D0F` and `midnight` `#171D22` remain in the palette but are no longer the default page ground.

Ink, in three steps: `ivory` `#F4EFE4` → `muted` `#BDB3A3` → `faint` `#8A8175`.

Accents: `amber` `#F0B35C` with `amber-hi` `#FFD18A` for hover · `copper` `#D48A45` · `sage` `#91A06B` · `wine` `#6F363D`.

Rules:

- Amber appears at most twice per viewport — one call to action plus one figure (a match score, an allowance). Labels, rules and eyebrows are never amber.
- Copper is for eyebrows, hairlines, small icons and gradients. Never a body-text colour.
- Sage means "positive / strong match" — including the slogan's full stop, which is the brand's own "this fits" note. Wine means "caution". Both are semantic, not decorative, and neither counts as the accent.

## Typography

Three roles, three faces, loaded through `next/font/google` in `app/layout.tsx`. The variable classes sit on `<html>` so the `--font-*` aliases declared on `:root` can resolve them.

- **Display — Fraunces** (`font-display`, variable, `SOFT`/`WONK` axes). H1, H2, plan and place names, empty-state titles.
- **Body / UI — Nunito Sans** (`font-sans`). Paragraphs, forms, navigation, buttons.
- **Micro / data — IBM Plex Mono** (`font-mono`). Eyebrows (`.eyebrow`), match scores, counters, timestamps. Pair with `tabular-nums` wherever digits line up.

Size scale (`text-*`), all fluid via `clamp()` so there is no breakpoint-to-breakpoint jump: `display-1`, `display-2`, `display-3`, `lead`, `body`, `label`. Never chain `text-4xl sm:text-5xl lg:text-6xl` again.

`cn()` in `lib/utils.ts` extends tailwind-merge with these custom font-size and radius groups; without that, `text-display-2` is mistaken for a colour class and silently dropped.

## The Menu Devices

The page is set the way a menu is set. These three devices carry the structure; reach for them before reaching for a card, a box or a shadow.

- **Leader row** (`.leader` + `.leader-fill`) — an item, a run of copper leader dots, a figure. Used for the hero pick, plan allowances and the scenario list.
- **Course rule** (`CourseRule`) — a label at the head of a hairline that runs the width of the column. This replaces the old eyebrow-stacked-above-every-heading pattern, which was the single most templated thing on the page. Use it on a few sections, not all of them.
- **Hung figures** — numerals set in the left margin, the way course numbers sit on a menu. Only for genuinely ordered content.

Cards are the exception. A group of related items gets a hairline above it and nothing around it. `.glass` survives for floating product panels inside the app, not for landing content.

The whole product carries a faint paper grain (`body::after`) so large flat fields read as printed rather than as a screen.

## Layout and Rhythm

- `.container-page` (max 80rem) and `.container-reading` (max 52rem) own the horizontal gutters. Sections should not set their own `px-*`.
- Vertical rhythm uses `py-section-sm | -md | -lg`. Vary it: two tall sections in a row should be followed by a compressed one.
- Radii: `rounded-card` (1.25rem), `rounded-panel` (1.75rem), `rounded-pill`.
- Running text stays near `max-w-measure` (68ch). Headings get `text-balance`, body copy `text-pretty`.

## Structure Carries Meaning

Numbered markers are only used where the content is genuinely a sequence — the three-step "how it works" flow. Context signals (mood, company, budget…) are a set and are rendered as an unordered row of lozenges. Do not add ordinal decoration to unordered content.

Sections use `components/ui/section.tsx`, which pairs each region with the `<h2>` that names it via `aria-labelledby`. Fictional preview content is never a heading.

## Component Principles

- Capability and feature blocks show a fragment of the real product (a chip row, a scan line, a match figure) rather than a decorative icon in a circle.
- Interactive targets are at least 44px tall (`min-h-11`), including navigation, chips and carousel controls.
- Empty states must look intentional and never fake backend data.
- Features the backend does not serve yet (menu scan, restaurant fit check) carry a visible "coming soon" marker everywhere they appear — landing capabilities, plan features, app navigation and dashboard cards.
- Public product copy should feel human and concierge-like. Do not mention internal architecture terms in visible UI.
- Landing-page carousel examples are fictional presentation mocks only and stay visually labelled as product preview content.

## Motion Principles

- Motion is purposeful and calm: opacity and transform only, with one exception — the hero headline settles its Fraunces `SOFT` and `WONK` axes over 700ms (`.display-warming`). It is the one animation that changes neither position nor opacity, so the largest element on the page is legible from the first frame.
- The motion budget for a viewport is one thing. In the hero that budget belongs to the live craving-to-pick record; the headline's axis settle is a one-shot on load and does not compete with it.
- Entry animation is limited to one orchestrated reveal per section. The hero renders without any mount animation so its content is in the server HTML.
- Never branch a motion `initial` prop on `useReducedMotion()`. That value differs between server and client, and the resulting hydration mismatch leaves content stuck at `opacity: 0`. Keep `initial` identical on both sides and gate motion through `transition={{ duration: reduceMotion ? 0 : … }}`.
- Keep the plate/orbital motif during generation. Avoid other loops.
- `prefers-reduced-motion` is handled globally in `globals.css` and per component through `useReducedMotion()`.

## Responsive Principles

Mobile is first-class. Target widths: 320, 390, 768, 1024, 1280, 1536+.

- Under `md`: sticky top bar plus bottom tab navigation, with `env(safe-area-inset-bottom)` padding.
- `md` to `lg`: a collapsed icon rail (`w-20`).
- `lg` and up: the full labelled sidebar (`w-72`).
- Use `100dvh`, not `100vh`, so mobile browser chrome does not cause jumps.
- Wide content (maps, chip rows, tables) scrolls inside its own container; the page body never scrolls horizontally.

## Dining Motif Rules

Use plate, table, glow, and orbital motifs tastefully. One warm light source per composition, anchored to the layout — not scattered blobs or grid overlays. Do not scatter cheap food icons everywhere. The motif should imply service, warmth, and a prepared table.
