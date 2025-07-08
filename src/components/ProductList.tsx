import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../api/products";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="loading-text">Chargement...</p>;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="product-search-input"
        />
        <button
          onClick={() => navigate("/panier")}
          className="product-list-button"
        >
          Voir le panier
        </button>
      </div>
      <div className="product-list-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          )) 
        ) : (
          <p>Aucun produit trouvé.</p>
        )}
      </div>
    </div>
  );
}
