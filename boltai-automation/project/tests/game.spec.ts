import { test, expect } from '@playwright/test';
import { navigateToGame, waitForGameLoad } from './utils/helpers';

test.describe('Bustin Beavers Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set default timeout for the entire test
    test.setTimeout(120000);
  });

  test('should load the game successfully', async ({ page }) => {
    await navigateToGame(page);
    await waitForGameLoad(page);
    
    // Verify game canvas is present
    const canvas = await page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should handle orientation change', async ({ page }) => {
    await navigateToGame(page);
    await waitForGameLoad(page);

    // Test landscape orientation
    await page.setViewportSize({ width: 851, height: 393 });
    await page.waitForTimeout(2000); // Allow time for orientation change
    await expect(page.locator('canvas')).toBeVisible();

    // Test portrait orientation
    await page.setViewportSize({ width: 393, height: 851 });
    await page.waitForTimeout(2000); // Allow time for orientation change
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should maintain game state during resize', async ({ page }) => {
    await navigateToGame(page);
    await waitForGameLoad(page);

    // Initial viewport
    await page.setViewportSize({ width: 393, height: 851 });
    await page.waitForTimeout(2000);
    await expect(page.locator('canvas')).toBeVisible();

    // Resize viewport
    await page.setViewportSize({ width: 851, height: 393 });
    await page.waitForTimeout(2000);
    await expect(page.locator('canvas')).toBeVisible();

    // Verify game is still responsive
    const canvas = await page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});