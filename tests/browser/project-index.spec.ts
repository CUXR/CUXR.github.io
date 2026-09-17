import { expect, test } from '@playwright/test';

test('project hashes, previews, and history stay synchronized', async ({ page }) => {
  await page.goto('/projects/#glove');
  const glove = page.locator('[data-project-control][href="#glove"]');
  const awake = page.locator('[data-project-control][href="#awake"]');
  await expect(glove).toBeFocused();
  await awake.hover();
  await expect(page.locator('#details-awake')).toBeVisible();
  await expect(page).toHaveURL(/#glove$/);
  await awake.click();
  await expect(page).toHaveURL(/#awake$/);
  await page.goBack();
  await expect(glove).toBeFocused();
  await expect(page.locator('#details-glove')).toBeVisible();
});

test('mobile hash opens one project and selection preserves viewport width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects/#olfactory');
  await expect(page.locator('[href="#olfactory"]')).toBeFocused();
  await expect(page.locator('#details-olfactory')).toBeVisible();
  await page.locator('[href="#glasses"]').click();
  await expect(page.locator('#details-glasses')).toBeVisible();
  await expect(page.locator('.project-index__details:visible')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('interrupted previews settle on the last project; reduced motion switches immediately', async ({ page }) => {
  await page.goto('/projects/');
  const awake = page.locator('[data-project-control][href="#awake"]');
  const bci = page.locator('[data-project-control][href="#bci"]');
  await awake.hover();
  await bci.hover();
  await awake.hover();
  await expect(page.locator('.project-index__details:visible')).toHaveCount(1);
  await expect(page.locator('#details-awake')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await bci.hover();
  await expect(page.locator('#details-bci')).toBeVisible();
  await expect.poll(() => page.locator('[data-project-index]').evaluate((root) => root.getAnimations({ subtree: true }).length)).toBe(0);
});
