import { test, expect } from '@playwright/test';

test('Échec de commande : produit en rupture de stock après ajout au panier', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const productName = 'T-shirt Coton Bio Blanc';
  const productCard = page.locator(`text=${productName}`).locator('..');
  const addButton = productCard.locator('button:has-text("Ajouter au panier")');

  const stockText = await productCard.locator('text=Stock :').innerText();
  
  const stockInitial = Number(stockText.replace('Stock : ', '').trim());

  for (let i = 0; i < stockInitial; i++) {
    await addButton.click();
  }

  await page.waitForTimeout(200);

  await expect(addButton).toBeDisabled();

  const panierButton = page.locator('button:has-text("Voir le panier")');
  const panierLink = page.locator('a:has-text("Panier")');

  if (await panierButton.count() > 0) {
    await expect(panierButton).toBeVisible({ timeout: 5000 });
    await panierButton.click();
  } else if (await panierLink.count() > 0) {
    await expect(panierLink).toBeVisible({ timeout: 5000 });
    await panierLink.click();
  } else {
    throw new Error('Bouton ou lien "Panier" introuvable sur la page');
  }

  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('Produit en rupture de stock.');
    await dialog.accept();
  });

  await page.evaluate(() => {
    const addBtn = document.querySelector('button:disabled');
    if (addBtn) {
      addBtn.dispatchEvent(new Event('click'));
    }
  });
});
