import { useCart } from "../store/cart";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();


  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

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
                value={quantity}
                onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                className="w-16 mx-2"
              />
              <span>{(product.price * quantity).toFixed(2)} €</span>
              <button onClick={() => removeFromCart(product.id)} className="text-red-500">
                Supprimer
              </button>
            </div>
          ))}
          <p className="mt-4 font-bold">Sous-total : {subtotal.toFixed(2)} €</p>
          <Link to="/livraison">
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Étape suivante</button>
          </Link>
        </>
      )}
    </div>
  );
}
