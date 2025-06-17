import { useCart } from "../store/cart";
import type { Product } from "../types/product";



export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
      if (product.stock >= 1) {
        addToCart(product, 1);
      } else {
        alert("Produit en rupture de stock.");
      }
    };



    return (
        <div className="border rounded-lg shadow-md p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-green-700 font-bold">{product.price.toFixed(2)} €</p>
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
              onClick={handleAdd}
            >
              Ajouter au panier
            </button>
        
        </div>
    );
}