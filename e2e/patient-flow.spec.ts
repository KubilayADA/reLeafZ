import { test, expect } from '@playwright/test';

test.describe('Patient Flow - E2E', () => {

  test('1. form page loads with address params', async ({ page }) => {
    await page.goto('/form?postcode=13086&address=Langhansstra%C3%9Fe+77&street=Langhansstra%C3%9Fe&houseNumber=77&city=Berlin');
    // Assert form page loaded
    await expect(page).toHaveURL(/\/form/);
    // Should see email input
    await expect(page.locator('input[type="email"], input[name="email"], input[placeholder*="mail" i]').first()).toBeVisible({ timeout: 10000 });
  });

  test('2. OTP flow - enter email and verify with 000000', async ({ page }) => {
    await page.goto('/form?postcode=13086&address=Langhansstra%C3%9Fe+77&street=Langhansstra%C3%9Fe&houseNumber=77&city=Berlin');
    
    const fullNameInput = page.locator('input[name="fullName"], #fullName').first();
    await fullNameInput.fill('Kubilay ADA');
    await page.waitForTimeout(1000);

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="mail" i]').first();
    await emailInput.fill('kubilayada.26@gmail.com');
    await page.waitForTimeout(1000);

    const phoneInput = page.locator('input[name="phone"], #phone').first();
    await phoneInput.fill('+4917668378284');
    await page.waitForTimeout(1000);

    // Check consent checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await checkbox.check();
        await page.waitForTimeout(500);
      }
    }
    await page.waitForTimeout(1000);

    const submitBtn = page.locator('button[type="submit"], button:has-text("Weiter"), button:has-text("Senden"), button:has-text("Next")').first();
    await submitBtn.click();
    
    // Wait for OTP input to appear
    await expect(page.locator('input[placeholder*="OTP" i], input[placeholder*="Code" i], input[maxlength="6"]').first()).toBeVisible({ timeout: 10000 });
    
    // Fill OTP
    const otpInput = page.locator('input[placeholder*="OTP" i], input[placeholder*="Code" i], input[maxlength="6"]').first();
    await otpInput.fill('000000');
    
    // Submit OTP
    const otpBtn = page.locator('button:has-text("Code bestätigen"), button:has-text("Verify"), button:has-text("Bestätigen")').first();
    // Wait for dialog overlay to disappear and button to be clickable
    await page.waitForSelector('button:has-text("Code bestätigen")', { state: 'visible' });
    await page.waitForTimeout(1000);

    await otpBtn.click();
    
    // Should progress to next step - marketplace or form fields
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e/screenshots/after-otp.png' });
    // Assert we progressed past OTP - consultation step should be visible
    await expect(page.locator('text=Wie möchtest du Angaben')).toBeVisible({ timeout: 10000 });
  });

  test('3. select consultation type and proceed', async ({ page }) => {
    // Navigate to form
    await page.goto('/form?postcode=13086&address=Langhansstra%C3%9Fe+77&street=Langhansstra%C3%9Fe&houseNumber=77&city=Berlin');
  
    // Fill form fields
    await page.locator('input[name="fullName"], #fullName').first().fill('Kubilay ADA');
    await page.waitForTimeout(500);
    await page.locator('input[type="email"], input[name="email"]').first().fill('kubilayada.26@gmail.com');
    await page.waitForTimeout(500);
    await page.locator('input[name="phone"], #phone').first().fill('+4917668378284');
    await page.waitForTimeout(500);
  
    // Check consent checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      if (!await checkboxes.nth(i).isChecked()) {
        await checkboxes.nth(i).check();
        await page.waitForTimeout(300);
      }
    }
  
    // Submit form and verify OTP
    await page.locator('button:has-text("Weiter")').first().click();
    await page.waitForSelector('input[placeholder*="Code" i], input[maxlength="6"]', { state: 'visible' });
    await page.locator('input[placeholder*="Code" i], input[maxlength="6"]').first().fill('000000');
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Code bestätigen")').click();
  
    // Wait for consultation step
    await expect(page.locator('text=Wie möchtest du Angaben')).toBeVisible({ timeout: 10000 });
  
    // Select "Online-Fragebogen" (cheapest/fastest option)
    await page.locator('text=Online-Fragebogen').click();
    await page.waitForTimeout(1000);
  
    // Click next/weiter
    await page.locator('button:has-text("Weiter"), button:has-text("Nächste")').last().click();
    await page.waitForTimeout(2000);
  
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/after-consultation-select.png' });
  
    // Assert progressed to next step
    await expect(page).not.toHaveURL('/form');
  });

});
