import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 1440]) {
  for (const route of ['/', '/projects/', '/team/', '/sponsor/', '/recruitment/']) {
    test(`${route} at ${width}px: accessible, complete, no overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(scan.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map((node) => node.target) }))).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test('mobile menu supports keyboard and Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('an open recruitment page expires links at the deadline', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-15T23:58:59-04:00') });
  await page.goto('/recruitment/');
  await expect(page.getByRole('link', { name: 'Start your application' })).toBeVisible();
  await page.clock.fastForward(1001);
  await expect(page.getByRole('link', { name: 'Start your application' })).toBeHidden();
  await expect(page.locator('.recruit-banner')).toBeHidden();
  await expect(page.locator('.recruitment-closed')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign up for a coffee chat' })).toBeHidden();
});

test('future recruitment opening and event expiry are automatic', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-15T23:59:59-04:00') });
  await page.goto('/recruitment/');
  await expect(page.locator('.recruit-banner')).toBeHidden();
  await page.clock.fastForward(1001);
  await expect(page.locator('.recruit-banner')).toBeVisible();
  await page.clock.setSystemTime(new Date('2026-09-21T19:00:00-04:00'));
  await page.reload();
  await expect(page.locator('.session').filter({ hasText: 'Phillips' })).toBeHidden();
  await expect(page.locator('.session').filter({ hasText: 'Hollister' })).toBeVisible();
});

test('carousel advances and pauses only while the carousel is hovered', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.locator('#featured').scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(page.locator('.featured__progress')).toHaveAttribute('data-running', 'true');
  await page.locator('.featured__intro').hover();
  await expect(page.locator('.featured__progress')).toHaveAttribute('data-running', 'true');
  await page.clock.fastForward(8100);
  await expect(page.locator('.featured__story h3')).toHaveText('Persistent-Memory Glasses');
  await page.locator('.featured__media').hover();
  await expect(page.locator('.featured__progress')).toHaveAttribute('data-running', 'false');
  await page.clock.fastForward(16000);
  await expect(page.locator('.featured__story h3')).toHaveText('Persistent-Memory Glasses');
  await page.mouse.move(1, 1);
  await expect(page.locator('.featured__progress')).toHaveAttribute('data-running', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('#featured').scrollIntoViewIfNeeded();
  await page.clock.fastForward(16000);
  await expect(page.locator('.featured__story h3')).toHaveText('Haptic Glove');
  expect(await page.locator('video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
});

test('team groups keep portraits and details connected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/team/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Subteams' }).getByRole('link', { name: 'Software', exact: true }).click();
  await expect(page).toHaveURL(/#software$/);
  await expect(page.locator('#software .team-member__role').first()).toHaveText('Software Lead');
  await expect(page.locator('#software .team-member__role').nth(2)).toHaveText('Software Engineer');
  await expect(page.locator('#alumni .team-member')).toHaveCount(3);
  await expect(page.locator('#alumni .team-member__role').first()).toHaveText('Software / Haptics');
  const member = page.locator('#software .team-member').first();
  const details = member.locator('.team-member__details');
  await member.scrollIntoViewIfNeeded();
  const before = await member.boundingBox();
  await member.locator('button').hover();
  await expect(details).toBeVisible();
  await member.getByRole('link', { name: 'LinkedIn' }).hover();
  await expect(details).toBeVisible();
  expect((await member.boundingBox())?.height).toBe(before?.height);
  await page.mouse.move(0, 0);
  await expect(details).toBeHidden();
  await page.keyboard.press('Tab');
  await member.locator('button').focus();
  await expect(details).toBeVisible();
});

test('team portraits toggle on touch without page overflow', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/team/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  const portrait = page.locator('.team-member__portrait').first();
  const details = page.locator('.team-member__details').first();
  await expect(details).toBeHidden();
  await portrait.tap();
  await expect(details).toBeVisible();
  await portrait.tap();
  await expect(details).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('team roster entries reveal on hover', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/team/');
  const member = page.locator('.team-member--compact').first();
  const details = member.locator('.team-member__details');
  await expect(details).toBeHidden();
  await member.hover();
  await expect(details).toBeVisible();
});

test('team roster entries toggle on touch', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/team/');
  const member = page.locator('.team-member--compact').first();
  const details = member.locator('.team-member__details');
  await expect(details).toBeHidden();
  await member.locator('.team-member__compact-toggle').tap();
  await expect(details).toBeVisible();
  await member.locator('.team-member__compact-toggle').tap();
  await expect(details).toBeHidden();
  await context.close();
});

test('core content and project links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore the project' })).toBeVisible();
  await page.goto('http://127.0.0.1:4321/team/');
  await expect(page.locator('.team-member')).toHaveCount(35);
  await expect(page.locator('.team-member__details').first()).toBeVisible();
  await context.close();
});
