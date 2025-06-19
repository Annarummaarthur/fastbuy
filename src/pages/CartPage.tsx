import { useState } from "react";
import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [stockErrors, setStockErrors] = useState<string[]>([]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const checkStockBeforeNext = () => {
    const errors: string[] = [];

    items.forEach(({ product, quantity }) => {
      if (quantity > product.stock) {
        errors.push(
          `Le produit "${product.name}" est en rupture ou quantité insuffisante.`
        );
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
    <div className="cart-container">
      <h2 className="cart-title">Votre panier</h2>

      <button
        onClick={() => navigate("/")}
        className="cart-button-secondary"
      >
        Voir les produits
      </button>

      {items.length === 0 ? (
        <p className="cart-empty-text">Panier vide.</p>
      ) : (
        <>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item">
              <div className="cart-item-name">{product.name}</div>
              <div className="cart-item-quantity">
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
                />
              </div>
              <div className="cart-item-price">
                {(product.price * quantity).toFixed(2)} €
              </div>
              <button
                onClick={() => {
                  removeFromCart(product.id);
                  setStockErrors([]);
                }}
                className="cart-item-remove"
              >
                Supprimer
              </button>
            </div>
          ))}

          <p className="cart-subtotal">Sous-total : {subtotal.toFixed(2)} €</p>

          {stockErrors.length > 0 && (
            <ul className="cart-error-list">
              {stockErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <button
            onClick={checkStockBeforeNext}
            className="cart-button-primary"
          >
            Étape suivante
          </button>
        </>
      )}
    </div>
  );
}
