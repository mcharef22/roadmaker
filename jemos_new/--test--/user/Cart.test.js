import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import Cart from "../../src/components/home/Cart"; // Ajustez le chemin si nécessaire
import { apiUrl } from "../../src/config"; // Ajustez le chemin si nécessaire

import i18n from "i18next";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("axios");
jest.mock("../../src/components/util/Toast", () => ({
  customToastNotify: jest.fn(),
}));
jest.mock("../../src/components/util/DialogBox", () => jest.fn());
jest.mock("../../src/components/util/Util", () => ({
  priceOfCart: jest.fn().mockReturnValue(50), // Adjust return value as needed
}));
jest.mock("../../src/components/map/gpx/Resources", () => ({
  USER_ROUTE: "/user/",
}));

const mockUserData = {
  _id: "12345",
  billingAddress: [],
};

const mockCart = [{ price: 50 }];

const renderCart = (props) => {
  return render(
    <Cart
      cart={props.cart}
      setCart={props.setCart}
      setVisibleComponent={props.setVisibleComponent}
      userData={props.userData}
      billingAddresses={props.billingAddresses}
    />
  );
};

describe("Cart Component", () => {
  let setCart, setVisibleComponent;

  beforeEach(() => {
    setCart = jest.fn();
    setVisibleComponent = jest.fn();
  });

  // Vérifie que les données utilisateur sont récupérées et mises à jour au montage

  it("fetches and updates user data on mount", async () => {
    axios.get.mockResolvedValue({ data: mockUserData });

    renderCart({
      cart: mockCart,
      setCart,
      setVisibleComponent,
      userData: mockUserData,
      billingAddresses: [],
    });

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(
        apiUrl + "/user/" + mockUserData._id
      )
    );
    expect(setCart).not.toHaveBeenCalled();
  });

  // Vérifie que le panier est vidé lorsque le bouton de suppression est cliqué

  it("empties the cart when the clear button is clicked", () => {
    renderCart({
      cart: mockCart,
      setCart,
      setVisibleComponent,
      userData: mockUserData,
      billingAddresses: [],
    });

    fireEvent.click(screen.getByText(/clearCart/i));

    expect(setCart).toHaveBeenCalledWith([]);
  });

  // Vérifie que le produit est retiré du panier

  it("removes a product from the cart", () => {
    renderCart({
      cart: mockCart,
      setCart,
      setVisibleComponent,
      userData: mockUserData,
      billingAddresses: [],
    });

    fireEvent.click(screen.getAllByLabelText("removeProduct")[0]);

    expect(setCart).toHaveBeenCalledWith([mockCart[1]]);
  });

  // Vérifie qu'une boîte de dialogue s'affiche s'il n'y a pas d'adresse de facturation lors du paiement

  it("shows a dialog if there is no billing address when paying", () => {
    const DialogBox = require("../../src/components/util/DialogBox");
    renderCart({
      cart: mockCart,
      setCart,
      setVisibleComponent,
      userData: mockUserData,
      billingAddresses: [],
    });

    fireEvent.click(screen.getByText(/pay/i));

    expect(DialogBox).toHaveBeenCalledWith({
      title: expect.any(String),
      text: expect.any(String),
      icon: "error",
      confirmButtonText: "OK",
    });
    expect(setVisibleComponent).not.toHaveBeenCalled();
  });

  it("sets visible component to PaymentForm if there is a billing address when paying", () => {
    const userDataWithBilling = {
      ...mockUserData,
      billingAddress: ["Address 1"],
    };
    renderCart({
      cart: mockCart,
      setCart,
      setVisibleComponent,
      userData: userDataWithBilling,
      billingAddresses: [],
    });

    fireEvent.click(screen.getByText(/pay/i));

    expect(setVisibleComponent).toHaveBeenCalledWith("PaymentForm");
  });
});
