import { useState } from "react";
import { useCart } from "../store/cart";
import type { Product } from "../types/product";
import "./ProductCard.css";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [localStock, setLocalStock] = useState(product.stock);

  const handleAdd = () => {
    if (localStock >= 1) {
      addToCart(product, 1);
      setLocalStock((prev) => prev - 1);
    } else {
      alert("Produit en rupture de stock.");
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p className="price">{product.price.toFixed(2)} €</p>
      <p className="stock">Stock : {localStock}</p>
      <button onClick={handleAdd} disabled={localStock === 0}>
        Ajouter au panier
      </button>
    </div>
  );
}
