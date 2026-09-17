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

Edit pages in `src/pages/` and structured content in `src/data/`. Put shared static assets in `public/media/`; its paths are served from `/media/`. Recruitment dates and links live in `src/data/recruitment.json`.

Member portraits live at `public/team/headshots/<member-id>.webp`. Set the member's `id` in `src/data/members.json`; the image URL is derived from it.

## GitHub Pages

In repository **Settings → Pages**, set the source to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` validates pull requests and deploys `dist/` from `main` when files change. The custom domain is set by `astro.config.mjs` and `public/CNAME`.
