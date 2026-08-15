import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import CreditCards from "../../src/components/payment/CreditCards";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


jest.mock("../../src/components/map/gpx/Resources", () => ({}));
jest.mock("axios");
jest.mock("@stripe/react-stripe-js", () => ({
  ...jest.requireActual("@stripe/react-stripe-js"),
  useStripe: jest.fn(),
  useElements: jest.fn(),
}));
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
const stripeTestPromise = loadStripe("pk_test_123");
describe("CreditCards Component", () => {
  it("renders CreditCards component", async () => {
    const userData = { _id: "123", stripeCustomerId: "cus_123" };

    axios.get.mockResolvedValueOnce({ data: { stripeCustomerId: "cus_123" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(
      <Elements stripe={stripeTestPromise}>
        <CreditCards userData={userData} />{" "}
      </Elements>
    );

    expect(screen.getByLabelText("Numéro de carte")).toBeInTheDocument();
    expect(screen.getByLabelText("Date d'expiration")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Code de vérification (CVV)")
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("addCard"))).toBeInTheDocument();
  });

  it("renders CreditCards component with no saved cards", async () => {
    const userData = { _id: "123", stripeCustomerId: "cus_123" };

    render(
      <Elements stripe={stripeTestPromise}>
        <CreditCards userData={userData} />{" "}
      </Elements>
    );

    expect(
      screen.getByText(i18n.t("noCard"))
    ).toBeInTheDocument();
  });

  it("call handleSubmit when clicking on Ajouter la carte button", async () => {
    const userData = { _id: "123", stripeCustomerId: "cus_123" };
    jest.spyOn(console, "log");
    axios.get.mockResolvedValueOnce({ data: { stripeCustomerId: "cus_123" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    render(
      <Elements stripe={stripeTestPromise}>
        <CreditCards userData={userData} />{" "}
      </Elements>
    );

    const addCardButton = screen.getByText(i18n.t("addCard"));
    fireEvent.click(addCardButton);

    expect(console.log).toHaveBeenCalledWith("jest: handleSubmit appelé");
  });
});
