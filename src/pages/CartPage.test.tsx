// CartPage.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "./CartPage";
import { useCart } from "../store/cart";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("../store/cart", () => ({
  useCart: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CartPage", () => {
  const updateQuantityMock = vi.fn();
  const removeFromCartMock = vi.fn();

  beforeEach(() => {
    (useCart as unknown as any).mockReturnValue({
      items: [
        {
          product: { id: 1, name: "Produit 1", price: 10 },
          quantity: 2,
        },
        {
          product: { id: 2, name: "Produit 2", price: 5 },
          quantity: 1,
        },
      ],
      updateQuantity: updateQuantityMock,
      removeFromCart: removeFromCartMock,
    });
    mockNavigate.mockClear();
    updateQuantityMock.mockClear();
    removeFromCartMock.mockClear();
  });

  it("affiche le panier avec les produits et sous-total", () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Votre panier")).toBeInTheDocument();
    expect(screen.getByText("Produit 1")).toBeInTheDocument();
    expect(screen.getByText("Produit 2")).toBeInTheDocument();

    // Vérifie les montants
    expect(screen.getByText("20.00 €")).toBeInTheDocument(); // 10 * 2
    expect(screen.getByText("5.00 €")).toBeInTheDocument();  // 5 * 1
    expect(screen.getByText("Sous-total : 25.00 €")).toBeInTheDocument();
  });

  it("appel updateQuantity quand on change la quantité", () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs.length).toBe(2);

    fireEvent.change(inputs[0], { target: { value: "3" } });
    expect(updateQuantityMock).toHaveBeenCalledWith(1, 3);
  });

  it("appel removeFromCart quand on clique sur supprimer", () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    const btns = screen.getAllByText("Supprimer");
    expect(btns.length).toBe(2);

    fireEvent.click(btns[0]);
    expect(removeFromCartMock).toHaveBeenCalledWith(1);
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
    (useCart as unknown as any).mockReturnValue({
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
