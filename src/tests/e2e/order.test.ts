import { test, expect } from '@playwright/test';

test('Parcours complet utilisateur', async ({ page }) => {
  // Aller sur la page d'accueil/catalogue
  await page.goto('http://localhost:5173/');

  // Sélectionner un produit (par exemple "T-shirt Coton Bio Blanc")
  const productName = 'T-shirt Coton Bio Blanc';
  const productCard = page.locator(`text=${productName}`).locator('..');
  const addButton = productCard.locator('button:has-text("Ajouter au panier")');

  // Vérifier que le bouton ajouter est activé
  await expect(addButton).toBeEnabled();

  // Ajouter 1 produit au panier
  await addButton.click();

  // Aller au panier
  // Recherche un lien ou bouton contenant "Panier" ou "Voir le panier"
  const panierLink = page.locator('a:has-text("Panier"), button:has-text("Panier"), a:has-text("Voir le panier"), button:has-text("Voir le panier")');
  await expect(panierLink).toBeVisible({ timeout: 7000 });
  await panierLink.first().click();

  // Cliquer sur "Étape suivante" (commander)
  const commanderButton = page.locator('button:has-text("Étape suivante")');
  await expect(commanderButton).toBeVisible();
  await commanderButton.click();

  // Attendre que le formulaire d'adresse soit visible avant de remplir
  await page.waitForSelector('input[name="nom"]', { timeout: 10000 });

  // DEBUG : Afficher le contenu HTML de la page pour vérification (les 500 premiers caractères)
  const htmlContent = await page.content();
  console.log('Contenu page après clic commander :', htmlContent.substring(0, 500));

  // Remplir le formulaire d'adresse
  await page.fill('input[name="nom"]', 'Jean Dupont');
  await page.fill('input[name="adresse"]', '123 rue Exemple');
  await page.fill('input[name="codePostal"]', '75001');
  await page.fill('input[name="ville"]', 'Paris');
  await page.fill('input[name="email"]', 'jean.dupont@example.com');
  await page.fill('input[name="telephone"]', '0600000000');

  // Valider l'adresse
  const validerAdresseButton = page.locator('button:has-text("Valider l\'adresse")');
  await expect(validerAdresseButton).toBeVisible();
  await validerAdresseButton.click();

  // Choisir un transporteur (par exemple premier dans la liste)
  const transporteurRadio = page.locator('input[type="radio"]').first();
  await expect(transporteurRadio).toBeVisible();
  await transporteurRadio.check();

  // Vérifier que le prix de livraison est affiché et correct (exemple)
  const prixLivraison = await page.locator('#prix-livraison').innerText();
  console.log('Prix livraison affiché:', prixLivraison);
  expect(prixLivraison).toMatch(/^\d+(\.\d{1,2})? €$/);

  // Cliquer sur "Payer" et gérer la popup de paiement
  page.once('dialog', async dialog => {
    console.log('Message du dialogue:', dialog.message());
    expect(dialog.message()).toBe('Paiement réussi !');
    await dialog.accept();
  });

  const payerButton = page.locator('button:has-text("Payer")');
  await expect(payerButton).toBeVisible();
  await payerButton.click();

  // Vérifier la confirmation de commande visible
  const confirmationMessage = page.locator('text=Étape suivante');
  await expect(confirmationMessage).toBeVisible();
});
