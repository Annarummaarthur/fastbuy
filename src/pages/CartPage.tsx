import { useState } from "react";
import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [stockErrors, setStockErrors] = useState<string[]>([]);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const checkStockBeforeNext = () => {
    const errors: string[] = [];

    items.forEach(({ product, quantity }) => {
      if (quantity > product.stock) {
        errors.push(`Le produit "${product.name}" est en rupture ou quantité insuffisante.`);
      }
    });

    if (errors.length > 0) {
      setStockErrors(errors);
      alert(errors.join("\n"));
    } else {
      navigate("/livraison");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Votre panier</h2>

      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Voir les produits
      </button>

      {items.length === 0 ? (
        <p>Panier vide.</p>
      ) : (
        <>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-center justify-between mb-2">
              <div>{product.name}</div>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0 && val <= product.stock) {
                    updateQuantity(product.id, val);
                    setStockErrors([]);
                  } else {
                    alert(`Quantité invalide. Stock disponible : ${product.stock}`);
                  }
                }}
                className="w-16 mx-2"
              />
              <span>{(product.price * quantity).toFixed(2)} €</span>
              <button
                onClick={() => {
                  removeFromCart(product.id);
                  setStockErrors([]);
                }}
                className="text-red-500"
              >
                Supprimer
              </button>
            </div>
          ))}
          <p className="mt-4 font-bold">Sous-total : {subtotal.toFixed(2)} €</p>

          {stockErrors.length > 0 && (
            <ul className="text-red-600 mt-2">
              {stockErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <button
            onClick={checkStockBeforeNext}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Étape suivante
          </button>
        </>
      )}
    </div>
  );
}
