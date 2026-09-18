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

| Script | Purpose |
| --- | --- |
| `vp run dev` | Generate responsive images, then start Astro with live reload. |
| `vp run build` | Generate responsive images, then build `dist/`. |
| `vp run preview` | Serve the last build in `dist/`; rebuild after edits. |
| `vp run check` | Run Astro/TypeScript checks. |
| `vp run test` | Run Node tests, including recruitment schedule checks. |
| `vp run test:browser` | Run Playwright browser tests. |
| `vp run images` | Regenerate responsive images without starting Astro. |

## Content

Edit pages in `src/pages/` and structured content in `src/data/`. Put shared static assets in `public/media/`; its paths are served from `/media/`. Recruitment dates and links live in `src/data/recruitment.json`. Omit either `applicationUrl` or `coffeeChatUrl` (or set it to `null`) when unavailable; each action appears only while recruitment is open and its URL is supplied.

`src/lib/content.ts` validates projects, members, and subteams when imported. Use unique lowercase, hyphenated `id` values: they become project anchors and member image names. `projects.json` controls project copy, imagery, `status` (`active`, `archived`, or `hidden`), and `featured`; hidden projects are excluded. `subteams.json` controls team sections and their order. In `members.json`, assign `teams` using the supported team IDs; `alumni` puts a member in the alumni section. `sponsorship.json` supplies the sponsorship email and packet link, while some page copy remains in `src/pages/sponsor.astro`. JSON changes must be committed and deployed to reach the live site.

Member portraits live at `public/team/headshots/<member-id>.webp`. Set the member's `id` in `src/data/members.json`; the image URL is derived from it.

### Recruitment schedule and banner

Edit `src/data/recruitment.json` for each cycle. `src/lib/recruitment.ts` validates it at build time and supplies the shared open/closed and upcoming-event logic. Set `season` and `audience` for displayed labels; `enabled: false` hides live recruitment regardless of dates. Recruitment is open from `opensAt` **inclusive** to `closesAt` **exclusive**. Use ISO timestamps with explicit UTC offsets (for example, `2026-09-16T00:00:00-04:00`); update the offset when daylight saving time changes. `timeZone` defaults to `America/New_York` and controls displayed dates/times, not the instant encoded by each timestamp.

`applicationUrl` and `coffeeChatUrl` must be HTTPS URLs when supplied. They feed the recruitment page, banner actions, and the guarded `/apply/` and `/coffeechat/` redirects. Those redirects fall back to `/recruitment/` outside the open window or when their URL is absent. `upperclassmenClosesAt` is required config data but currently does **not** control a separate window or banner; the active window uses only `opensAt` and `closesAt`. Update any season-specific prose in `src/pages/recruitment.astro` separately.

Each `events` entry needs a unique `id`, `title`, `location`, `startsAt`, and `endsAt`; the end must follow the start. Events appear in the recruitment page's info-session list in JSON order until `endsAt` (exclusive), so enter them chronologically. The banner's Info Sessions link appears only while at least one listed event has not ended. The `title` is validated but is not currently rendered in that list. Remove or replace old events when preparing a new cycle.

The banner appears site-wide only during the open window. The recruitment page stays available year-round, showing closed-state copy when appropriate. Browser code rechecks the clock on page load, at least once per minute, at scheduled boundaries, and when the tab becomes visible, so an already-open page can hide expired links. The site is still static: config edits require a deployment, and a build made after an event ended cannot later add that event or its banner link. Deploy updated data before a new window begins; CI checks schema and logic, not whether manually entered dates, locations, and URLs are factually correct.

## Image delivery

`vp run dev` and `vp run build` generate responsive AVIF, WebP, and JPEG photos in `public/optimized/`. Originals remain in `public/`; generated files are ignored by Git and cached locally. Run `vp run images` after replacing photos during development. `scripts/optimize-images.ts` controls encoding; `src/lib/image.ts` defines shared widths.

The hero uses `public/media/cuxr-hero-optimized.mp4`, encoded from the original with:

```sh
ffmpeg -i public/media/cuxr-hero.mp4 -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart public/media/cuxr-hero-optimized.mp4
```

## GitHub Pages

In repository **Settings → Pages**, set the source to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` validates pull requests to `main` and pushes to `main` or `redesign`; only `main` pushes deploy `dist/`. It does not run on a schedule, so date boundaries alone do not trigger a rebuild. The custom domain is set by `astro.config.mjs` and `public/CNAME`.
