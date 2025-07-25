import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "./ProductCard";
import { useCart } from "../store/cart";

vi.mock("../store/cart", () => ({
  useCart: vi.fn(),
}));

describe("ProductCard", () => {
  const product = {
    id: 1,
    name: "Produit Test",
    price: 12.99,
    image: "test-image.jpg",
    stock: 10,
  };

  const addToCartMock = vi.fn();

  beforeEach(() => {
    (useCart as unknown as any).mockReturnValue({
      addToCart: addToCartMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("affiche les informations du produit", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`${product.price} €`)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", product.image);
  });

  it("ajoute le produit au panier au clic sur le bouton", () => {
    render(<ProductCard product={product} />);
    fireEvent.click(screen.getByText(/Ajouter au panier/i));
    expect(addToCartMock).toHaveBeenCalledWith(product, 1);
  });
});
