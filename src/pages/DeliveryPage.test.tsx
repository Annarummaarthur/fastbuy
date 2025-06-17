// DeliveryPage.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeliveryPage from "./DeliveryPage";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("DeliveryPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    sessionStorage.clear();
  });

  it("affiche les champs du formulaire", () => {
    render(
      <BrowserRouter>
        <DeliveryPage />
      </BrowserRouter> 
    );

    const placeholders = [
      "firstName",
      "lastName",
      "address",
      "zip",
      "city",
      "country",
      "phone",
    ];

    placeholders.forEach((placeholder) => {
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });
  });

  it("affiche les erreurs si formulaire invalide après soumission", () => {
    render(
      <BrowserRouter>
        <DeliveryPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Étape suivante"));

    expect(screen.getByText("Prénom requis")).toBeInTheDocument();
    expect(screen.getByText("Nom requis")).toBeInTheDocument();
    expect(screen.getByText("Adresse requise")).toBeInTheDocument();
    expect(screen.getByText("Code postal invalide")).toBeInTheDocument();
    expect(screen.getByText("Ville requise")).toBeInTheDocument();
    expect(screen.getByText("Pays requis")).toBeInTheDocument();
    expect(screen.getByText("Téléphone invalide")).toBeInTheDocument();
  });

  it("met à jour les champs du formulaire", () => {
    render(
      <BrowserRouter>
        <DeliveryPage />
      </BrowserRouter>
    );

    const firstNameInput = screen.getByPlaceholderText("firstName") as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: "Jean" } });
    expect(firstNameInput.value).toBe("Jean");
  });

  it("soumet correctement et navigue quand le formulaire est valide", () => {
    render(
      <BrowserRouter>
        <DeliveryPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("firstName"), { target: { value: "Jean" } });
    fireEvent.change(screen.getByPlaceholderText("lastName"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText("address"), { target: { value: "12 rue de Paris" } });
    fireEvent.change(screen.getByPlaceholderText("zip"), { target: { value: "75001" } });
    fireEvent.change(screen.getByPlaceholderText("city"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText("country"), { target: { value: "France" } });
    fireEvent.change(screen.getByPlaceholderText("phone"), { target: { value: "0123456789" } });

    fireEvent.click(screen.getByText("Étape suivante"));

    expect(sessionStorage.getItem("delivery")).toBe(
      JSON.stringify({
        firstName: "Jean",
        lastName: "Dupont",
        address: "12 rue de Paris",
        zip: "75001",
        city: "Paris",
        country: "France",
        phone: "0123456789",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/transport");
  });

  it("navigue vers la page panier quand on clique sur 'Étape précédente'", () => {
    render(
      <BrowserRouter>
        <DeliveryPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Étape précédente"));
    expect(mockNavigate).toHaveBeenCalledWith("/panier");
  });
});
