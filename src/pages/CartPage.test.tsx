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

describe("CartPage", () => {
  const updateQuantityMock = vi.fn();
  const removeFromCartMock = vi.fn();

  beforeEach(() => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [
        {
          product: { id: 1, name: "Test produit", price: 10, image: "img.jpg", stock: 10 },
          quantity: 1,
        },
        {
          product: { id: 2, name: "Produit 2", price: 5, image: "img2.jpg", stock: 5 },
          quantity: 2,
        },
      ],
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
    const input = screen.getByDisplayValue("1");
    fireEvent.change(input, { target: { value: "3" } });
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
