const { test, expect } = require('@playwright/test');

// Visual audit — screenshot every section at desktop and mobile
test.describe('Visual Audit', () => {
  test('full page desktop screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // wait for animations
    await page.screenshot({ path: 'screenshots/desktop-full.png', fullPage: true });
  });

  test('hero section desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.locator('#hero').screenshot({ path: 'screenshots/hero-desktop.png' });
  });

  test('nav scrolled state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);
    await page.locator('#nav').screenshot({ path: 'screenshots/nav-scrolled.png' });
  });

  test('services section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#services').screenshot({ path: 'screenshots/services-desktop.png' });
  });

  test('about section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#about').screenshot({ path: 'screenshots/about-desktop.png' });
  });

  test('gallery section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#gallery').screenshot({ path: 'screenshots/gallery-desktop.png' });
  });

  test('testimonials section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#testimonials').screenshot({ path: 'screenshots/testimonials-desktop.png' });
  });

  test('pricing section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#pricing').screenshot({ path: 'screenshots/pricing-desktop.png' });
  });

  test('faq section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#faq').screenshot({ path: 'screenshots/faq-desktop.png' });
  });

  test('contact section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('#contact').screenshot({ path: 'screenshots/contact-desktop.png' });
  });

  test('footer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.locator('footer').screenshot({ path: 'screenshots/footer-desktop.png' });
  });

  test('full page mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });
  });

  test('hero mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.locator('#hero').screenshot({ path: 'screenshots/hero-mobile.png' });
  });

  test('nav mobile open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.locator('#hamburger').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/nav-mobile-open.png' });
  });
});
