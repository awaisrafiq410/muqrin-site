# Muqrin for Real Estate Development — Website

Static 4-page marketing site for a Saudi real estate developer. Plain HTML/CSS/JS, no build step, no framework, no backend (forms submit via Web3Forms).

## Reference sites (used for structure/content inspiration)
- https://saqeefah.com/en (form page pattern)
- https://www.aleen.sa/en (stats strip, section rhythm)
- https://almajdiah.com/
- https://alajlaninvest.com/

## Pages
- `index.html` — Home. Hero (headline + building render + Google Maps link), stats strip, 3 "why us" pillar cards, CTA band.
- `about.html` — Vision / Mission panels, "how we work" pillars, standards blurb, CTA to careers.
- `interest.html` — "Express Interest" lead form (name, phone, email, unit type, budget, message).
- `careers.html` — Careers application form (name, phone, email, position, experience, CV link, cover message).

All four share the same header/footer markup (hand-copied into each file — no templating system, so any nav/footer change must be repeated across all 4 HTML files).

## Files
```
site/
  index.html
  about.html
  interest.html
  careers.html
  styles.css        <- single shared stylesheet, all design tokens at top
  script.js         <- mobile nav toggle, scroll-reveal, Web3Forms submit handler
  assets/
    logo.png            <- cropped from client's brand guide screenshot
    favicon.png          <- cropped teal hexagon mark from brand guide
    hero-building.jpeg    <- client's building render, used in home hero
```

## Design system (in styles.css :root)
Colors pulled directly from the client's brand guide screenshot:
- `--cream: #F1E9DD` — page background
- `--cream-soft: #F8F3EA` — card/section-alt background
- `--teal-deep: #163832` — primary brand color (nav, headings, buttons)
- `--teal-ink: #0E2621` — darkest, footer/CTA band background
- `--copper: #BC8552` / `--copper-soft: #D9B48B` — accent color
- Font: IBM Plex Sans Arabic (Google Fonts import at top of styles.css) — matches client's brand guide which specifies this as their bilingual typeface, 7 weights. IBM Plex Mono used for small mono "eyebrow"/label text.

**Signature visual motifs** (deliberately pulled from the client's own brand assets, not generic):
- `.cut` / `.cut-sm` — a chamfered top-right corner (clip-path), copied from the hexagon color swatches in the brand guide. Used on hero image frame, meant to be reusable for cards/buttons.
- `.lattice` / the diagonal-checker background on dark panels (`.vm-panel::before`, `.form-side::before`) — echoes the perforated metal screen facade visible in the building render.
- `.plate` — small dark tag overlay on the hero image ("PROJECT 01 — RIYADH"), styled like the unit-number plates visible in the render (e.g. "C 02-03").

## Forms — Web3Forms
Both `interest.html` and `careers.html` POST to `https://api.web3forms.com/submit`.
- Access key currently hardcoded in both forms' hidden `<input name="access_key">`: `d75ba735-b4da-4de5-9a0d-ba020ae77ecb`
- Progressive enhancement: forms work via plain HTML POST even with JS disabled (real `action`/`method` on the `<form>`), and `script.js` intercepts submit for forms with `data-web3forms` attribute to do an AJAX submit instead (no page reload, inline "Sending..." state, success panel swap, inline error message on failure).
- **Important bug already fixed once**: don't `formData.append('access_key', ...)` again in JS — it's already a hidden input in the HTML. Doing both sends it twice as an array and Web3Forms rejects with "Form ID/Access key must be a string."
- Field names are lowercase (`name`, `email`, `phone`, `message`, etc.) — Web3Forms uses `email` specifically to set reply-to on the notification email.
- Each form sets its own `subject` hidden input for filtering inbox notifications.

## Mobile responsiveness — fixed issues (context for future work)
1. **Hero grid bug**: originally had an inline `style="grid-template-columns: 1fr 1fr"` directly on the hero wrapper in `index.html`, which overrode the responsive CSS and forced 2 columns even on phone screens (squeezed text, tiny image). Fixed by removing the inline style and adding a proper `.hero-grid-split` class that's single-column by default and only switches to 2 columns via `@media (min-width: 900px)`.
2. **Eyebrow label wrapping bug**: the small mono-font label (e.g. "For Real Estate Development") is a flex container with a `::before` decorative line + text. It had `align-items: center`, which vertically centered the short decorative line against the *whole* wrapped text block — so on narrow screens where the label text wrapped to 2–3 lines, the line appeared to float in the middle of the text instead of next to the first line. Fixed with `align-items: flex-start` + a small `margin-top` on `::before` to align it with the cap-height of line 1.
3. **Mobile nav dropdown bleed-through**: the hamburger menu was `position: absolute` and only as tall as its own content (~254px). Page content directly below continued in normal flow, so if the underlying page's paragraph text started right where the dropdown ended, it visually looked like text was bleeding into/behind the menu (it wasn't real transparency — the dropdown just didn't cover far enough down, so the page text picked up right at the seam with no gap, looking glitchy). Fixed by making `.nav-links` `position: fixed` covering full viewport height below the header (`top:68px; bottom:0`), with `max-height: calc(100vh - 68px)` when open, plus a box-shadow. Also added body scroll-lock while the menu is open (`document.body.style.overflow = 'hidden'`), and auto-close-on-link-click.
4. General mobile pass: reduced header height (68px mobile / 84px desktop), smaller logo on mobile (30px vs 40px), reduced `.wrap` side padding on small screens (20px vs 32px), reduced section/hero/form/CTA vertical padding on mobile via `@media (min-width: ...)` breakpoints so nothing feels oversized or cramped, stats grid is 2-col on mobile instead of 4-col.

## Outstanding / needs client input
- **Footer social icons** (Instagram, TikTok, X) currently link to `#` — placeholders. Need real handles/URLs.
- **Contact email** — placeholder addresses used in a couple of spots (`info@muqrindevelopments.sa`, `careers@muqrindevelopments.sa`) for display copy (not for form submission — that's handled by Web3Forms regardless of what's shown in copy). Confirm real addresses if these are shown anywhere as contact info.
- Project location Google Maps link is live and correct: `https://maps.app.goo.gl/naK4TaDF8p9UgyYY6?g_st=iw` — appears on home hero, footer, and interest.html contact panel.
- No CMS/backend — content edits mean editing the HTML files directly. If the client wants to add more projects/pages later, will need to either template it manually (copy-paste pattern used so far) or move to a static site generator.
- Not yet tested cross-browser beyond Chromium (used Playwright/Chromium for local screenshot QA during this session). Worth a manual pass in Safari/Firefox before going live, especially the `clip-path` chamfer corners and `aspect-ratio` CSS (broad support, but verify).
- Currently testing via `python3 -m http.server` locally — no deployment/hosting set up yet.
