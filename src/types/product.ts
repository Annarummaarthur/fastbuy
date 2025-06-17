export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;    // Quantité dispo en stock
  weight?: number;  // Poids unitaire optionnel (kg ou g)
};
