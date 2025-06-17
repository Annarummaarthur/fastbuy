import { useState } from "react";
import { useCart } from "../store/cart";
import type { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [localStock, setLocalStock] = useState(product.stock);

  const handleAdd = () => {
    if (localStock >= 1) {
      addToCart(product, 1);
      setLocalStock(prev => prev - 1);
    } else {
      alert("Produit en rupture de stock.");
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-green-700 font-bold">{product.price.toFixed(2)} €</p>
      <p className="text-sm text-gray-500">Stock : {localStock}</p>
      <button
        onClick={handleAdd}
        disabled={localStock === 0}
      >
        Ajouter au panier
      </button>


    </div>
  );
}
