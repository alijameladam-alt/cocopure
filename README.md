# Coconut Water — Brand Mood Board

A single-page, self-contained web mood board for a potential coconut water
brand. No build step, no frameworks — just open `index.html`.

## What's inside

- **Hero** — brand name + tagline
- **Essence** — vibe statement and mood keywords
- **Colour palette** — editable hex swatches
- **Visual texture** — a masonry photo grid (self-hosted images)
- **On Social** — Instagram reel thumbnails (currently @h2coco)
- **Live from Pinterest** — an optional live board embed
- **Typography** — font specimens

## The hybrid approach (why it looks good *and* stays flexible)

| Content | Best method | Why |
|---|---|---|
| Photos / stills | **Self-host** in `/images` | Full-image masonry, fast, full control |
| Pinterest | **Embed** a live board/pin | Stays up to date automatically |
| Instagram / TikTok | **Screenshot → self-host** | Their embeds are flaky (login walls) |

## How to add your real content

### 1. Photos
Drop saved photos into `images/`, then add a tile inside `.grid` in
`index.html`. The grid is a masonry column layout, so images display in full
at their natural aspect ratio — no cropping:
```html
<figure class="tile">
  <img src="images/your-photo.jpg" alt="describe the vibe" loading="lazy" />
  <figcaption>Short label</figcaption>
</figure>
```

### 2. Instagram reels
Instagram blocks reel preview images for logged-out visitors, so live embeds
show blank for many viewers. Instead we use **self-hosted thumbnails** that
always display. To add a reel: save a cover frame to `/images`, then add a
card inside `.reel-grid`:
```html
<a class="reel-card" href="https://www.instagram.com/reel/REEL_ID/" target="_blank" rel="noopener">
  <img src="images/reel-REEL_ID.webp" alt="describe it" loading="lazy" />
  <span class="reel-play" aria-hidden="true"></span>
  <span class="reel-cap">“Short caption from the reel.”</span>
</a>
```

### 3. Pinterest
Replace the `href` in the `data-pin-do="embedBoard"` block with the brand's
real board URL. The Pinterest script renders it automatically.

## Colours
Edit the hex values in the `.swatch` blocks (`index.html`) and the `:root`
variables at the top of `styles.css`.

## Deploying a shareable link
This is static, so it works on any static host:
- **Netlify** — drag-and-drop the folder, or connect this repo
- **GitHub Pages** — enable Pages on the branch
- **Vercel / Cloudflare Pages** — point at the repo

> All imagery is placeholder until final assets are added.
