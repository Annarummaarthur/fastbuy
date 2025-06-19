import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";
import "./ShippingPage.css";

type Carrier = {
  id: number;
  name: string;
  price: number;
  delay: string;
};

export default function ShippingPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();
  const { items } = useCart();

  const totalWeight = items.reduce(
    (sum, item) => sum + (item.product.weight || 0) * item.quantity,
    0
  );

  useEffect(() => {
    setTimeout(() => {
      setCarriers([
        { id: 1, name: "Colissimo", price: 4.99, delay: "48h" },
        { id: 2, name: "Chronopost", price: 9.99, delay: "24h" },
      ]);
    }, 300);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const carrierPrice = selected ? carriers.find(c => c.id === selected)?.price || 0 : 0;
  const total = subtotal + carrierPrice;

  const handleNext = () => {
    if (selected !== null) {
      const chosen = carriers.find((c) => c.id === selected);
      if (chosen) {
        sessionStorage.setItem("carrier", JSON.stringify(chosen));
        navigate("/paiement");
      }
    }
  };

  return (
    <div className="shipping-container">
      <h2 className="shipping-title">Choix du transporteur</h2>
      <p className="shipping-weight">Poids total du panier : {totalWeight.toFixed(2)} kg</p>

      {carriers.length === 0 && <p className="shipping-loading">Chargement des transporteurs...</p>}

      {carriers.map((carrier) => (
        <label
          key={carrier.id}
          className="shipping-option"
        >
          <input
            type="radio"
            name="carrier"
            value={carrier.id}
            checked={selected === carrier.id}
            onChange={() => setSelected(carrier.id)}
          />
          <span>
            {carrier.name} — {carrier.price.toFixed(2)} € ({carrier.delay})
          </span>
        </label>
      ))}

      <p className="shipping-total">Total : {total.toFixed(2)} €</p>

      <div className="shipping-buttons">
        <button
          onClick={() => navigate("/livraison")}
          className="shipping-button-back"
        >
          Étape précédente
        </button>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className="shipping-button-next"
        >
          Étape suivante
        </button>
      </div>
    </div>
  );
}
