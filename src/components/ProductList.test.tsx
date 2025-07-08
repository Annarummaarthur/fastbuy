import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProductList from "./ProductList";
import * as api from "../api/products";
import { BrowserRouter } from "react-router-dom";

const mockProducts = [
  { id: 1, name: "Produit 1", price: 10, image: "img1.jpg" },
  { id: 2, name: "Produit 2", price: 20, image: "img2.jpg" },
];

vi.mock("../api/products", () => ({
  fetchProducts: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ProductList", () => {
  beforeEach(() => {
    (api.fetchProducts as unknown as any).mockResolvedValue(mockProducts);
    mockNavigate.mockClear();
  });

  it("affiche le chargement au début", () => {
    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );
    expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
  });

  it("affiche la liste des produits après chargement", async () => {
    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    await waitFor(() => {
      mockProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });
  });

  it("navigue vers /panier quand on clique sur le bouton", async () => {
    render(
      <BrowserRouter>
        <ProductList />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText(mockProducts[0].name));

    fireEvent.click(screen.getByText(/Voir le panier/i));
    expect(mockNavigate).toHaveBeenCalledWith("/panier");
  });
});
