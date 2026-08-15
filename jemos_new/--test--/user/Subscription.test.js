import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Subscription from "../../src/components/user/Subscription";
import BillingAddressForm from "../../src/components/user/billingAddress/BillingAddressForm";
import i18n from "i18next";
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));



jest.mock("axios");
jest.mock("../../src/components/map/gpx/Resources", () => ({}));
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => {
    return {
      customers: {
        create: jest.fn().mockResolvedValue({ id: "stripeCustomerId" }),
      },
      paymentMethods: {
        list: jest.fn().mockResolvedValue({ data: [] }),
      },
    };
  });
});

describe("Subscription", () => {
  const addToCart = jest.fn();
  const userData = {
    _id: "123",
    email: "test@test.com",
    pack: "Standard",
  };
  const cart = [
    {
      name: "Abonnement Premium",
      price: 0.5,
    },
  ];

  test("renders Subscription with Standard pack", async () => {
    const cart = [
      {
        name: "Abonnement x",
        price: 0.5,
      },
    ];
    axios.get.mockResolvedValueOnce({ data: userData });
    const logSpy = jest.spyOn(console, "log");

    render(
      <Subscription userData={userData} cart={cart} addToCart={addToCart} />
    );

    fireEvent.click(screen.getByLabelText("Actions sur l'abonnement"));

    const premiumButton = screen.getByText(i18n.t("addToCart"));

    expect(premiumButton).toBeInTheDocument();

    fireEvent.click(premiumButton);
    expect(logSpy).toHaveBeenCalledWith("jest : produit ajouté au panier");
  });

  test("Add a product that already exists", async () => {
    const cart = [
      {
        id: "premiumSub",
        name: "Abonnement Premium",
        price: 0.5,
      },
    ];
    axios.get.mockResolvedValueOnce({ data: userData });
    const logSpy = jest.spyOn(console, "log");

    render(<Subscription userData={userData} cart={cart} addToCart={addToCart} />);

    fireEvent.click(screen.getByLabelText("Actions sur l'abonnement"));

    const premiumButton = screen.getByText(i18n.t("addToCart"));

    expect(premiumButton).toBeInTheDocument();

    fireEvent.click(premiumButton);
    expect(logSpy).toHaveBeenCalledWith("jest : produit existe Déjà");
  });

  test("renders Subscription with Premium pack", async () => {
    userData.pack = "Premium";
    axios.get.mockResolvedValueOnce({ data: userData });

    render(<Subscription userData={userData} />);

    const premiumButton = screen.getByText(i18n.t("unsubscribing"));
    const statusIcon = screen.getByTestId("status-icon");

    expect(premiumButton).toBeInTheDocument();
    expect(statusIcon).toHaveClass("text-success");

    fireEvent.click(premiumButton);

    await waitFor(() => {
      const confirmButton = screen.getByText(i18n.t("yes"));
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
