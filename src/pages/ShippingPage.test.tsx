import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShippingPage from "./ShippingPage";
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
  product: { id: number; name: string; price: number; weight: number };
  quantity: number;
};

describe("ShippingPage", () => {
  const navigateMock = vi.fn();

  const items: CartItem[] = [
    { product: { id: 1, name: "Produit 1", price: 10, weight: 0.5 }, quantity: 2 },
    { product: { id: 2, name: "Produit 2", price: 5, weight: 1 }, quantity: 1 },
  ];

  const getExpectedWeight = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.product.weight * item.quantity, 0).toFixed(2);

  const getProductTotal = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);

  const getTotalWithShipping = (productTotal: string, shippingCost: number) =>
    (parseFloat(productTotal) + shippingCost).toFixed(2);

  beforeEach(() => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ items });
    (reactRouterDom.useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(navigateMock);
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("affiche le poids total et les transporteurs après chargement", async () => {
    render(
      <BrowserRouter>
        <ShippingPage />
      </BrowserRouter>
    );

    const expectedWeight = getExpectedWeight(items);
    expect(screen.getByText(`Poids total du panier : ${expectedWeight} kg`)).toBeInTheDocument();
    expect(screen.getByText("Chargement des transporteurs...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/Colissimo/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Chronopost/)).toBeInTheDocument();
    });
  });

  it("permet de sélectionner un transporteur et active le bouton", async () => {
    render(
      <BrowserRouter>
        <ShippingPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Colissimo/)).toBeInTheDocument();
    });

    const colissimoRadio = screen.getByLabelText(/Colissimo/) as HTMLInputElement;
    const nextButton = screen.getByText("Étape suivante") as HTMLButtonElement;

    expect(nextButton).toBeDisabled();

    fireEvent.click(colissimoRadio);
    expect(colissimoRadio.checked).toBe(true);
    expect(nextButton).toBeEnabled();

    const productTotal = getProductTotal(items);
    const totalWithShipping = getTotalWithShipping(productTotal, 4.99);

    expect(screen.getByText(`Total : ${totalWithShipping} €`)).toBeInTheDocument();
  });

  it("navigue vers /livraison au clic sur Étape précédente", async () => {
    render(
      <BrowserRouter>
        <ShippingPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Étape précédente"));
    expect(navigateMock).toHaveBeenCalledWith("/livraison");
  });

  it("stocke le transporteur sélectionné et navigue vers paiement", async () => {
    render(
      <BrowserRouter>
        <ShippingPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByLabelText(/Chronopost/));

    const chronopostRadio = screen.getByLabelText(/Chronopost/) as HTMLInputElement;
    fireEvent.click(chronopostRadio);

    fireEvent.click(screen.getByText("Étape suivante"));

    const storedCarrier = JSON.parse(sessionStorage.getItem("carrier") || "{}");
    expect(storedCarrier.name).toBe("Chronopost");
    expect(storedCarrier.price).toBe(9.99);

    expect(navigateMock).toHaveBeenCalledWith("/paiement");
  });

  it("navigue pas à l'étape suivante si aucun transporteur sélectionné", async () => {
    render(
      <BrowserRouter>
        <ShippingPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByLabelText(/Colissimo/));

    const nextButton = screen.getByText("Étape suivante") as HTMLButtonElement;

    expect(nextButton).toBeDisabled();

    fireEvent.click(nextButton);

    expect(navigateMock).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("carrier")).toBeNull();
  });
});
