// PaymentPage.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PaymentPage from "./PaymentPage";
import { useCart } from "../store/cart";
import { BrowserRouter } from "react-router-dom";
import * as reactRouterDom from "react-router-dom";

vi.mock("../store/cart");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof reactRouterDom>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("PaymentPage", () => {
  const clearCartMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [
        { product: { id: 1, name: "Produit 1", price: 10 }, quantity: 2 },
        { product: { id: 2, name: "Produit 2", price: 5 }, quantity: 1 },
      ],
      clearCart: clearCartMock,
    });

    sessionStorage.setItem(
      "delivery",
      JSON.stringify({ address: "123 Rue", zip: "75000", city: "Paris" })
    );
    sessionStorage.setItem(
      "carrier",
      JSON.stringify({ name: "DHL", price: 7 })
    );

    (reactRouterDom.useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);

    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });


  it("affiche les produits, livraison, transporteur et total", () => {
    render(
      <BrowserRouter>
        <PaymentPage />
      </BrowserRouter>
    );

    expect(screen.getByText("Produit 1 x2 — 20.00 €")).toBeInTheDocument();
    expect(screen.getByText("Produit 2 x1 — 5.00 €")).toBeInTheDocument();
    expect(screen.getByText(/123 Rue, 75000 Paris/)).toBeInTheDocument();
    expect(screen.getByText(/DHL \(7.00 €\)/)).toBeInTheDocument();
    expect(screen.getByText("Total : 32.00 €")).toBeInTheDocument(); // 20 + 5 + 7
  });

  it("navigue à la page transport au clic sur Étape précédente", () => {
    render(
      <BrowserRouter>
        <PaymentPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Étape précédente"));
    expect(navigateMock).toHaveBeenCalledWith("/transport");
  });

  it("réussit le paiement, affiche alert, vide le panier et navigue à la page d'accueil", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    render(
      <BrowserRouter>
        <PaymentPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Payer"));

    expect(window.alert).toHaveBeenCalledWith("Paiement réussi !");
    expect(clearCartMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("échoue le paiement et affiche alert", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1); // échec (<=0.2)

    render(
      <BrowserRouter>
        <PaymentPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Payer"));

    expect(window.alert).toHaveBeenCalledWith("Paiement échoué, réessayez.");
    expect(clearCartMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalledWith("/");
  });
});
