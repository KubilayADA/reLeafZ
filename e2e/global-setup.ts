import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/form?postcode=13086&address=Langhansstra%C3%9Fe+77&street=Langhansstra%C3%9Fe&houseNumber=77&city=Berlin');

  await page.locator('input[name="fullName"], #fullName').first().fill('Kubilay ADA');
  await page.waitForTimeout(300);
  await page.locator('input[type="email"], input[name="email"]').first().fill('kubilayada.26@gmail.com');
  await page.waitForTimeout(300);
  await page.locator('input[name="phone"], #phone').first().fill('+4917668378284');
  await page.waitForTimeout(300);

  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    if (!await checkboxes.nth(i).isChecked()) {
      await checkboxes.nth(i).check();
      await page.waitForTimeout(200);
    }
  }

  await page.locator('button:has-text("Weiter")').first().click();
  await page.waitForSelector('input[maxlength="6"]', { state: 'visible' });
  await page.locator('input[maxlength="6"]').first().fill('000000');
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Code bestätigen")').click();
  await page.waitForTimeout(2000);

  // Save storage state (cookies + localStorage)
  await page.context().storageState({ path: 'e2e/storageState.json' });

  await browser.close();
}

export default globalSetup;
