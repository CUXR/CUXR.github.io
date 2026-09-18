import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import members from '../../src/data/members.json' with { type: 'json' };
import subteams from '../../src/data/subteams.json' with { type: 'json' };

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
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  const header = page.locator('.site-header');
  const main = page.locator('main');
  const headerBefore = await header.boundingBox();
  const mainBefore = await main.boundingBox();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(nav).toBeVisible();
  const headerAfter = await header.boundingBox();
  const mainAfter = await main.boundingBox();
  const navBox = await nav.boundingBox();
  expect(headerAfter?.height).toBe(headerBefore?.height);
  expect(mainAfter?.y).toBe(mainBefore?.y);
  expect(navBox?.y).toBe(headerAfter!.y + headerAfter!.height - 1);
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(nav).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await page.locator('#site-nav').evaluate((element) => getComputedStyle(element).transitionDuration)).toContain('0.18s');
  await toggle.click();
  await expect.poll(() => nav.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  await toggle.click();
  await expect(nav).toBeHidden();
});

test('mobile recruitment banner links the copy beside inline icon actions', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const copyLink = page.locator('.banner-copy--mobile');
    await expect(copyLink).toHaveAttribute('href', /forms\.gle/);
    await expect(copyLink.locator('.banner-outlink')).toHaveText('↗');
    await expect(page.getByRole('link', { name: 'Coffee chat' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Info sessions' })).toBeVisible();
    const copy = await copyLink.boundingBox();
    const inner = await page.locator('.recruit-banner-inner').boundingBox();
    expect(copy!.width).toBeLessThan(inner!.width);
    const actions = await page.locator('.banner-actions a:visible').all();
    const boxes = await Promise.all(actions.map((action) => action.boundingBox()));
    expect(boxes).toHaveLength(2);
    expect(boxes[0]!.y).toBe(boxes[1]!.y);
    expect(boxes[0]!.x).toBeGreaterThanOrEqual(copy!.x + copy!.width);
    expect(boxes[1]!.x).toBeGreaterThanOrEqual(boxes[0]!.x + boxes[0]!.width);
    expect(Math.max(...boxes.map((box) => box!.x + box!.width))).toBeLessThanOrEqual(inner!.x + inner!.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const url = page.url();
    await page.locator('.recruit-banner').click({ position: { x: 5, y: 5 } });
    expect(page.url()).toBe(url);
  }
});

test('desktop recruitment banner keeps Apply as the only application link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.banner-action-label')).toHaveCount(2);
  await expect(page.locator('.banner-action-label').first()).toBeVisible();
  await expect(page.locator('.banner-info-icon')).toBeHidden();
  await expect(page.locator('.banner-button--apply')).toBeVisible();
  await expect(page.locator('.banner-copy--desktop')).not.toHaveAttribute('href');
  await expect(page.locator('.banner-copy--mobile')).toBeHidden();
});

test('recruitment copy link and Apply follow the text layout breakpoint', async ({ page }) => {
  for (const width of [601, 760, 761, 900, 1000, 1001]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const copy = page.locator(width <= 1000 ? '.banner-copy--mobile' : '.banner-copy--desktop');
    const title = await copy.locator('strong').boundingBox();
    const deadline = await copy.locator('.banner-deadline').boundingBox();
    const apply = page.locator('.banner-button--apply');
    if (width <= 1000) {
      expect(deadline!.y).toBeGreaterThan(title!.y);
      await expect(copy).toHaveAttribute('href', /forms\.gle/);
      await expect(apply).toBeHidden();
    } else {
      expect(deadline!.y).toBe(title!.y);
      await expect(copy).not.toHaveAttribute('href');
      await expect(apply).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
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
  await page.clock.fastForward(5100);
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
  for (const { id } of [...subteams, { id: 'alumni' }]) {
    const roster = members.filter((member) => member.teams.includes('alumni')
      ? id === 'alumni'
      : member.teams.some((team) => team === id));
    await expect(page.locator(`#${id} .team-member`)).toHaveCount(roster.length);
  }
  await expect(page.locator('.team-member__details').first()).toBeVisible();
  await context.close();
});
