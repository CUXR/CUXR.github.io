import { test, expect } from '@playwright/test';

for (const route of ['/', '/team/', '/sponsor/']) {
  test(`${route}: responsive photos load with JPEG fallback`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const photos = page.locator('picture img');
    expect(await photos.count()).toBeGreaterThan(0);
    const selected = await photos.evaluateAll(async (images) => {
      return Promise.all(images.map(async (element) => {
        const img = element as HTMLImageElement;
        img.loading = 'eager';
        await img.decode();
        return { src: img.currentSrc, width: img.getAttribute('width'), height: img.getAttribute('height') };
      }));
    });
    for (const photo of selected) {
      expect(photo.src).toMatch(/\.avif$/);
      expect(Number(photo.width)).toBeGreaterThan(0);
      expect(Number(photo.height)).toBeGreaterThan(0);
    }
    // Isolate fallback markup so React hydration cannot restore picture sources.
    const fallbackMarkup = await page.locator('picture').evaluateAll((pictures) => pictures.map((picture) => {
      const clone = picture.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('source').forEach((source) => source.remove());
      return clone.outerHTML;
    }).join(''));
    const fallbackPage = await page.context().newPage();
    await fallbackPage.route(page.url(), (route) => route.fulfill({ contentType: 'text/html', body: fallbackMarkup }));
    await fallbackPage.goto(page.url());
    const fallbackSources = await fallbackPage.locator('picture img').evaluateAll(async (images) => Promise.all(images.map(async (element) => {
      const img = element as HTMLImageElement;
      img.loading = 'eager';
      await img.decode();
      return img.currentSrc;
    })));
    for (const src of fallbackSources) expect(src).toMatch(/\.jpg$/);
    await fallbackPage.close();
  });
}
