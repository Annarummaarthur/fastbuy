import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const { items, clearCart } = useCart();
  const delivery = JSON.parse(sessionStorage.getItem("delivery") || "{}");
  const carrier = JSON.parse(sessionStorage.getItem("carrier") || "{}");
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Récapitulatif</h2>
      <ul>
        {items.map(({ product, quantity }) => (
          <li key={product.id}>
            {product.name} x{quantity} — {(product.price * quantity).toFixed(2)} €
          </li>
        ))}
      </ul>
      <p><strong>Livraison à :</strong> {delivery.address}, {delivery.zip} {delivery.city}</p>
      <p><strong>Transporteur :</strong> {carrier.name} ({carrier.price.toFixed(2)} €)</p>
      <p className="font-bold">Total : {total.toFixed(2)} €</p>
      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Payer
      </button>
    </div>
  );
}
