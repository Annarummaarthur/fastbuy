import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryPage.css";

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
    <form onSubmit={handleSubmit} className="delivery-form">
      <h2 className="delivery-title">Informations de livraison</h2>

      {Object.entries(form).map(([key, value]) => (
        <div key={key} className="delivery-input-group">
          <input
            type="text"
            placeholder={key}
            value={value}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="delivery-input"
          />
          {errors[key] && <p className="delivery-error">{errors[key]}</p>}
        </div>
      ))}

      <div className="delivery-buttons">
        <button
          type="button"
          onClick={() => navigate("/panier")}
          className="delivery-button-back"
        >
          Étape précédente
        </button>
        <button type="submit" className="delivery-button-submit">
          Étape suivante
        </button>
      </div>
    </form>
  );
}
