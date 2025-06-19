import { test, expect } from '@playwright/test';

test('Sélection transporteur et vérification prix livraison dynamique', async ({ page }) => {
  await page.goto('http://localhost:5173/transport');

  const transporteurs = page.locator('input[type="radio"]');
  const prixLivraison = page.locator('p.shipping-total');

  const count = await transporteurs.count();

  for (let i = 0; i < count; i++) {
    await transporteurs.nth(i).check();
    const prixText = await prixLivraison.innerText();
    console.log(`Transporteur #${i + 1} - Prix affiché: ${prixText}`);
    expect(prixText).toMatch(/^Total\s?:\s?\d+(\.\d{1,2})? €$/);
  }
});
