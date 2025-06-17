import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    // ⚠️ Remplacer par ton appel réel si tu simules une API
    setCarriers([
      { id: 1, name: "Colissimo", price: 4.99, delay: "48h" },
      { id: 2, name: "Chronopost", price: 9.99, delay: "24h" },
    ]);
  }, []);

  const handleNext = () => {
    if (selected !== null) {
      const chosen = carriers.find((c) => c.id === selected);
      sessionStorage.setItem("carrier", JSON.stringify(chosen));
      navigate("/paiement");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Choix du transporteur</h2>
      {carriers.map((carrier) => (
        <label key={carrier.id} className="block mb-2 border p-2 rounded cursor-pointer">
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
      <button
        onClick={handleNext}
        disabled={selected === null}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        Étape suivante
      </button>
    </div>
  );
}
