import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/cart";

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

  // Calcul poids total panier (ex: poids unitaire * quantité)
  const totalWeight = items.reduce(
    (sum, item) => sum + (item.product.weight || 0) * item.quantity,
    0
  );

  useEffect(() => {
    // Simuler appel API avec infos livraison & poids
    // Ici juste un setTimeout pour simuler async
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
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Choix du transporteur</h2>
      <p>Poids total du panier : {totalWeight.toFixed(2)} kg</p>

      {carriers.length === 0 && <p>Chargement des transporteurs...</p>}

      {carriers.map((carrier) => (
        <label
          key={carrier.id}
          className="block mb-2 border p-2 rounded cursor-pointer"
        >
          <input
            type="radio"
            name="carrier"
            value={carrier.id}
            checked={selected === carrier.id}
            onChange={() => setSelected(carrier.id)}
          />
          <span className="ml-2">
            {carrier.name} — {carrier.price.toFixed(2)} € ({carrier.delay})
          </span>
        </label>
      ))}

      <p className="font-bold mt-2">Total : {total.toFixed(2)} €</p>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => navigate("/livraison")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Étape précédente
        </button>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Étape suivante
        </button>
      </div>
    </div>
  );
}
