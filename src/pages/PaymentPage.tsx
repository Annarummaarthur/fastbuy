import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

export default function PaymentPage() {
  const { items, clearCart } = useCart();
  const delivery = JSON.parse(sessionStorage.getItem("delivery") || "{}");
  const carrier = JSON.parse(sessionStorage.getItem("carrier") || "{}");
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const total = subtotal + (carrier.price || 0);

  const handlePayment = () => {
    // Simulation : succès aléatoire
    const success = Math.random() > 0.2;
    if (success) {
      alert("Paiement réussi !");
      clearCart();
      navigate("/");
    } else {
      alert("Paiement échoué, réessayez.");
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-title">Récapitulatif</h2>

      <ul className="payment-list">
        {items.map(({ product, quantity }) => (
          <li key={product.id}>
            {product.name} x{quantity} — {(product.price * quantity).toFixed(2)} €
          </li>
        ))}
      </ul>

      <p className="payment-info">
        <strong>Livraison à :</strong> {delivery.address}, {delivery.cp || delivery.zip}{" "}
        {delivery.ville || delivery.city}
      </p>
      <p className="payment-info">
        <strong>Transporteur :</strong> {carrier.name} (
        {carrier.price ? carrier.price.toFixed(2) : "0.00"} €)
      </p>

      <p className="payment-total">Total : {total.toFixed(2)} €</p>

      <div className="payment-buttons">
        <button
          onClick={() => navigate("/transport")}
          className="payment-button-back"
        >
          Étape précédente
        </button>

        <button
          onClick={handlePayment}
          className="payment-button-pay"
        >
          Payer
        </button>
      </div>
    </div>
  );
}
