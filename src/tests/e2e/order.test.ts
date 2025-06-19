import { test, expect } from '@playwright/test';

test('Parcours complet utilisateur', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const productName = 'T-shirt Coton Bio Blanc';
  const productCard = page.locator(`text=${productName}`).locator('..');
  const addButton = productCard.locator('button:has-text("Ajouter au panier")');
  await expect(addButton).toBeEnabled();
  await addButton.click();

  const panierLink = page.locator('button:has-text("Voir le panier")').first();
  await expect(panierLink).toBeVisible({ timeout: 7000 });
  await panierLink.click();

  const commanderButton = page.locator('button:has-text("Étape suivante")');
  await expect(commanderButton).toBeVisible();
  await commanderButton.click();

  await page.waitForSelector('input[placeholder="firstName"]', { timeout: 10000 });

  await page.fill('input[placeholder="firstName"]', 'Jean');
  await page.fill('input[placeholder="lastName"]', 'Dupont');
  await page.fill('input[placeholder="address"]', '123 rue Exemple');
  await page.fill('input[placeholder="zip"]', '75001');
  await page.fill('input[placeholder="city"]', 'Paris');
  await page.fill('input[placeholder="country"]', 'France');
  await page.fill('input[placeholder="phone"]', '0600000000');

  const validerAdresseButton = page.locator('button:has-text("Étape suivante")');
  await expect(validerAdresseButton).toBeVisible();
  await validerAdresseButton.click();

  const transporteurRadio = page.locator('input[type="radio"]').first();
  await expect(transporteurRadio).toBeVisible();
  await transporteurRadio.check();

  const continuerButton = page.locator('button:has-text("Étape suivante")');
  await expect(continuerButton).toBeVisible();
  await continuerButton.click();

  await page.waitForURL('**/paiement', { timeout: 5000 });
  await expect(page.locator('text=Récapitulatif')).toBeVisible();

  const totalText = await page.locator('p.payment-total').innerText();
  // console.log('Prix livraison affiché:', totalText);
  expect(totalText).toMatch(/^Total\s?:\s?\d+(\.\d{1,2})? €$/);

  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Paiement réussi !');
    await dialog.accept();
  });

  const payerButton = page.locator('button:has-text("Payer")');
  await expect(payerButton).toBeVisible({ timeout: 5000 });
  await payerButton.click();

  await page.waitForURL('**/', { timeout: 5000 });
});
