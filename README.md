# Cornell XR

Astro static site for CUXR. Requires Node 24; dependencies use the pinned pnpm version in `package.json`.

## Local development

```sh
vp install
vp run dev
vp run check
vp run test
vp run build
```

`vp run build` writes the deployable site to `dist/`. Run browser tests with `vp exec playwright install chromium` and `vp run test:browser`.

## Content

Edit pages in `src/pages/` and structured content in `src/data/`. Put shared static assets in `public/media/`; its paths are served from `/media/`. Recruitment dates and links live in `src/data/recruitment.json`. Omit either `applicationUrl` or `coffeeChatUrl` (or set it to `null`) when unavailable; each action appears only while recruitment is open and its URL is supplied.

Member portraits live at `public/team/headshots/<member-id>.webp`. Set the member's `id` in `src/data/members.json`; the image URL is derived from it.

## Image delivery

`vp run dev` and `vp run build` generate responsive AVIF, WebP, and JPEG photos in `public/optimized/`. Originals remain in `public/`; generated files are ignored by Git and cached locally. Run `vp run images` after replacing photos during development. `scripts/optimize-images.ts` controls encoding; `src/lib/image.ts` defines shared widths.

The hero uses `public/media/cuxr-hero-optimized.mp4`, encoded from the original with:

```sh
ffmpeg -i public/media/cuxr-hero.mp4 -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart public/media/cuxr-hero-optimized.mp4
```

## GitHub Pages

In repository **Settings → Pages**, set the source to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` validates pull requests and deploys `dist/` from `main` when files change. The custom domain is set by `astro.config.mjs` and `public/CNAME`.
