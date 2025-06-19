import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryPage.css";

export default function DeliveryPage() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    address: "",
    cp: "",
    ville: "",
    pays: "",
    numero: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.prenom) newErrors.prenom = "Prénom requis";
    if (!form.nom) newErrors.nom = "Nom requis";
    if (!form.address) newErrors.address = "Adresse requise";
    if (!/^\d{5}$/.test(form.cp)) newErrors.cp = "Code postal invalide";
    if (!form.ville) newErrors.ville = "Ville requise";
    if (!form.pays) newErrors.pays = "Pays requis";
    if (!/^\d{10}$/.test(form.numero)) newErrors.numero = "Téléphone invalide";
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
