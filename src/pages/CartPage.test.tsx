import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "./CartPage";
import { useCart } from "../store/cart";
import { BrowserRouter } from "react-router-dom";

vi.mock("../store/cart");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

type CartItem = {
  product: { id: number; name: string; price: number; image: string; stock: number };
  quantity: number;
};

describe("CartPage", () => {
  const updateQuantityMock = vi.fn();
  const removeFromCartMock = vi.fn();

  // Données dynamiques pour les tests
  const items: CartItem[] = [
    {
      product: { id: 1, name: "Test produit", price: 10, image: "img.jpg", stock: 10 },
      quantity: 1,
    },
    {
      product: { id: 2, name: "Produit 2", price: 5, image: "img2.jpg", stock: 5 },
      quantity: 2,
    },
  ];

  beforeEach(() => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items,
      updateQuantity: updateQuantityMock,
      removeFromCart: removeFromCartMock,
    });
    vi.clearAllMocks();
  });

  it("appel updateQuantity quand on change la quantité", () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    items.forEach(({ quantity }, index) => {
      const input = screen.getAllByRole("spinbutton")[index];
      const newQuantity = quantity + 2;

      fireEvent.change(input, { target: { value: String(newQuantity) } });

      expect(updateQuantityMock).toHaveBeenCalledWith(items[index].product.id, newQuantity);
    });
  });

  it("appel removeFromCart quand on clique sur supprimer", () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByText("Supprimer");
    expect(buttons.length).toBe(items.length);

    buttons.forEach((btn, index) => {
      fireEvent.click(btn);
      expect(removeFromCartMock).toHaveBeenCalledWith(items[index].product.id);
      removeFromCartMock.mockClear(); // Reset mock pour le test propre de chaque clic
    });
  });

  it("navigue vers la page produits quand on clique sur le bouton", () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Voir les produits"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("affiche un message si le panier est vide", () => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      updateQuantity: updateQuantityMock,
      removeFromCart: removeFromCartMock,
    });

    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Panier vide.")).toBeInTheDocument();
  });
});
