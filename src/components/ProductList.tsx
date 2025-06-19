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

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="loading-text">Chargement...</p>;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <button
          onClick={() => navigate("/panier")}
          className="product-list-button"
        >
          Voir le panier
        </button>
      </div>
      <div className="product-list-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
