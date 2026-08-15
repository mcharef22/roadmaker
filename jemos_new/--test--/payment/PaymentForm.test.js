import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import PaymentForm from "../../src/components/payment/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import i18n from "i18next";
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
describe("PaymentForm Component", () => {
  const cart = [{ name: "Abonnement x", price: 0.5 }];

  it("renders PaymentForm component", async () => {
    const userData = { _id: "123", stripeCustomerId: "cus_123" };
    axios.get.mockResolvedValueOnce({ data: { stripeCustomerId: "cus_123" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(
      <Elements stripe={stripeTestPromise}>
        <PaymentForm userData={userData} cart={cart} />{" "}
      </Elements>
    );

    expect(screen.getByText(i18n.t("cartPayment"))).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t("enjoyCart"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Informations de la carte")
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("pay"))).toBeInTheDocument();
  });

  it("renders PaymentForm component with no saved cards", async () => {
    const userData = { _id: "123", stripeCustomerId: "cus_123" };

    render(
      <Elements stripe={stripeTestPromise}>
        <PaymentForm userData={userData} cart={cart} />{" "}
      </Elements>
    );

    expect(
      screen.getByText(i18n.t("noCard"))
    ).toBeInTheDocument();
  });

  it("call handleSubmit when clicking on Payer button", async () => {
    const userData = { _id: "123", stripeCustomerId: "cus_123" };
    jest.spyOn(console, "log");
    axios.get.mockResolvedValueOnce({ data: { stripeCustomerId: "cus_123" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    render(
      <Elements stripe={stripeTestPromise}>
        <PaymentForm userData={userData} cart={cart} />{" "}
      </Elements>
    );

    const PaymentButton = screen.getByText(i18n.t("pay"));
    fireEvent.click(PaymentButton);

    expect(console.log).toHaveBeenCalledWith("jest: handleSubmit appelé");
  });
});
