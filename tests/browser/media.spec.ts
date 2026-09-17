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
    await page.locator('picture source').evaluateAll((sources) => sources.forEach((source) => source.remove()));
    await expect.poll(() => photos.first().evaluate((element) => (element as HTMLImageElement).currentSrc)).toMatch(/\.jpg$/);
    await photos.first().evaluate((element) => (element as HTMLImageElement).decode());
  });
}
