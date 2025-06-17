import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zip: "",
    city: "",
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.firstName) newErrors.firstName = "Prénom requis";
    if (!form.lastName) newErrors.lastName = "Nom requis";
    if (!form.address) newErrors.address = "Adresse requise";
    if (!/^\d{5}$/.test(form.zip)) newErrors.zip = "Code postal invalide";
    if (!form.city) newErrors.city = "Ville requise";
    if (!form.country) newErrors.country = "Pays requis";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Téléphone invalide";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length === 0) {
      sessionStorage.setItem("delivery", JSON.stringify(form));
      navigate("/transport");
    } else {
      setErrors(errs);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">Informations de livraison</h2>

      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <input
            type="text"
            placeholder={key}
            value={value}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full p-2 border rounded"
          />
          {errors[key] && <p className="text-red-600">{errors[key]}</p>}
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/panier")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Étape précédente
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Étape suivante
        </button>
      </div>
    </form>
  );
}
