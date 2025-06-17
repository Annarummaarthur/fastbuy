import { test, expect } from '@playwright/test';

test('Validation erreurs formulaire livraison', async ({ page }) => {
  await page.goto('http://localhost:5173/livraison');

  await page.waitForSelector('button:has-text("Étape suivante")', { timeout: 10000 });

  await page.click('button:has-text("Étape suivante")');

  await expect(page.getByText('Prénom requis', { exact: true })).toBeVisible();
  await expect(page.getByText('Nom requis', { exact: true })).toBeVisible();
  await expect(page.getByText('Adresse requise', { exact: true })).toBeVisible();
  await expect(page.getByText('Code postal invalide', { exact: true })).toBeVisible();
  await expect(page.getByText('Ville requise', { exact: true })).toBeVisible();
  await expect(page.getByText('Pays requis', { exact: true })).toBeVisible();
  await expect(page.getByText('Téléphone invalide', { exact: true })).toBeVisible();
});
