import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SavedCards from "../../src/components/payment/SavedCards";
import i18n from "i18next";
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


describe("SavedCards Component", () => {
  const mockSavedCards = [
    {
      id: "1",
      card: {
        funding: "credit",
        last4: "1234",
        exp_month: 12,
        exp_year: 2023,
        brand: "Visa",
      },
    },
    // Add more mock saved cards as needed
  ];

  it("renders saved cards correctly", () => {
    render(
      <SavedCards
        savedCards={mockSavedCards}
        handlePayWithSavedCard={() => {}}
        handleRemoveSavedCard={() => {}}
        hidePaymentBouton={false}
      />
    );

    // Check if the saved card details are rendered
    expect(screen.getByText(i18n.t("card") + " credit")).toBeInTheDocument();
    expect(screen.getByText("**** **** **** 1234")).toBeInTheDocument();
    expect(screen.getByText("12/2023")).toBeInTheDocument();
    expect(screen.getByText("Visa")).toBeInTheDocument();

    // Check if the remove button is rendered
    expect(screen.getByRole("button", { name: "🗑️" })).toBeInTheDocument();

    // Check if the payment button is rendered
    expect(
      screen.getByRole("button", { name: i18n.t("payWithThisCard") })
    ).toBeInTheDocument();
  });

  it("calls handleRemoveSavedCard when the remove button is clicked", () => {
    const mockRemoveHandler = jest.fn();

    render(
      <SavedCards
        savedCards={mockSavedCards}
        handlePayWithSavedCard={() => {}}
        handleRemoveSavedCard={mockRemoveHandler}
        hidePaymentBouton={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "🗑️" }));

    expect(mockRemoveHandler).toHaveBeenCalledWith(mockSavedCards[0]);
  });

  it("calls handlePayWithSavedCard when the payment button is clicked", () => {
    const mockPaymentHandler = jest.fn();

    render(
      <SavedCards
        savedCards={mockSavedCards}
        handlePayWithSavedCard={mockPaymentHandler}
        handleRemoveSavedCard={() => {}}
        hidePaymentBouton={false}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("payWithThisCard") })
    );

    expect(mockPaymentHandler).toHaveBeenCalledWith(mockSavedCards[0]);
  });

  it("renders 'Aucune carte enregistrée' message when there are no saved cards", () => {
    render(
      <SavedCards
        savedCards={[]}
        handlePayWithSavedCard={() => {}}
        handleRemoveSavedCard={() => {}}
        hidePaymentBouton={false}
      />
    );

    expect(
      screen.getByText(i18n.t("noCard"))
    ).toBeInTheDocument();
  });
});
