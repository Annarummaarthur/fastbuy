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

type CartItem = {
  product: { id: number; name: string; price: number };
  quantity: number;
};

describe("PaymentPage", () => {
  const clearCartMock = vi.fn();
  const navigateMock = vi.fn();

  const items: CartItem[] = [
    { product: { id: 1, name: "Produit 1", price: 10 }, quantity: 2 },
    { product: { id: 2, name: "Produit 2", price: 5 }, quantity: 1 },
  ];

  const delivery = { address: "123 Rue", zip: "75000", city: "Paris" };
  const carrier = { name: "DHL", price: 7 };

  const getProductTotal = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const getTotal = (items: CartItem[], carrierPrice: number) =>
    (getProductTotal(items) + carrierPrice).toFixed(2);

  beforeEach(() => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      items,
      clearCart: clearCartMock,
    });

    sessionStorage.setItem("delivery", JSON.stringify(delivery));
    sessionStorage.setItem("carrier", JSON.stringify(carrier));

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

    items.forEach(({ product, quantity }) => {
      const totalPrice = (product.price * quantity).toFixed(2);
      expect(
        screen.getByText(`${product.name} x${quantity} — ${totalPrice} €`)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(new RegExp(`${delivery.address}, ${delivery.zip} ${delivery.city}`))
    ).toBeInTheDocument();

    expect(
      screen.getByText(new RegExp(`${carrier.name} \\(${carrier.price.toFixed(2)} €\\)`))
    ).toBeInTheDocument();

    expect(screen.getByText(`Total : ${getTotal(items, carrier.price)} €`)).toBeInTheDocument();
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
    vi.spyOn(Math, "random").mockReturnValue(0.1);

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
