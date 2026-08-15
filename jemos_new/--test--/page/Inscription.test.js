import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Inscription from "../../src/components/login/Inscription";
import { apiUrl } from "../../src/config";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/login/Connexion", () => ({}));
jest.mock("../../src/components/map/gpx/Resources", () => ({
  USER_ROUTE: "/user/",
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

describe("Inscription component", () => {
  let mockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  test("inputs exist, and inscription works correctly", async () => {
    jest.spyOn(console, "log");
    const { getByLabelText, getByText } = render(<Inscription />);

    const identifiantInput = getByLabelText("Identifiant");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Mot-de-passe");
    const confirmPasswordInput = getByLabelText("confirm-password");

    fireEvent.change(identifiantInput, { target: { value: "JohnDoe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });

    expect(identifiantInput.value).toBe("JohnDoe");
    expect(emailInput.value).toBe("john.doe@example.com");
    expect(passwordInput.value).toBe("password");
    expect(confirmPasswordInput.value).toBe("password");

    // Simuler la réponse à la requête POST d'inscription
    mockAdapter.onPost(apiUrl + "/user").reply(200, {
      name: "JohnDoe",
      email: "john.doe@example.com",
      password: "password",
      confirmed: false,
      customwpts: "",
      _id: "user123", // Assurez-vous d'ajouter un ID pour simuler une réponse réussie
    });

    // Simuler la réponse à la requête PUT après la création du client Stripe
    mockAdapter.onPut(apiUrl + "/user/user123").reply(200, {
      stripeCustomerId: "stripe123", // Simuler un stripeCustomerId
    });

    const button = getByText(i18n.t("signUp"));
    fireEvent.click(button);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: Inscription réussie");
      console.log.mockRestore();
    });
  });

  test("inputs exist, and different password", async () => {
    jest.spyOn(console, "log");
    const { getByLabelText, getByText } = render(<Inscription />);

    const identifiantInput = getByLabelText("Identifiant");
    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Mot-de-passe");
    const confirmPasswordInput = getByLabelText("confirm-password");

    fireEvent.change(identifiantInput, { target: { value: "JohnDoe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "passsword" } });

    expect(identifiantInput.value).toBe("JohnDoe");
    expect(emailInput.value).toBe("john.doe@example.com");
    expect(passwordInput.value).toBe("password");
    expect(confirmPasswordInput.value).toBe("passsword");

    mockAdapter.onPost(apiUrl + "/user").reply(400);

    const button = getByText(i18n.t("signUp"));
    fireEvent.click(button);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: Mots de passe différents"
      );
      console.log.mockRestore();
    });
  });

  // test("inputs exist, and email already exists", async () => {
  //   jest.spyOn(console, "log"); // Espionnez la méthode log de l'objet console
  //   const existingEmail = "existing@example.com";
  //   const existUser = [
  //     {
  //       name: "JohnDoe",
  //       email: existingEmail,
  //       password: "password123",
  //     },
  //   ];

  //   mockAdapter.onGet(apiUrl + "/users").reply(200, existUser);
  //   const { getByLabelText, getByText } = render(<Inscription />);

  //   const identifiantInput = getByLabelText("Identifiant");
  //   const emailInput = getByLabelText("Email");
  //   const passwordInput = getByLabelText("Mot de passe");
  //   const confirmPasswordInput = getByLabelText("Confirmer mot de passe");

  //   fireEvent.change(identifiantInput, { target: { value: "JohnDoe" } });
  //   fireEvent.change(emailInput, { target: { value: existingEmail } });
  //   fireEvent.change(passwordInput, { target: { value: "password" } });
  //   fireEvent.change(confirmPasswordInput, { target: { value: "password" } });

  //   expect(identifiantInput.value).toBe("JohnDoe");
  //   expect(emailInput.value).toBe(existingEmail);
  //   expect(passwordInput.value).toBe("password");
  //   expect(confirmPasswordInput.value).toBe("password");

  //   const button = getByText("S'inscrire");
  //   fireEvent.click(button);

  //   await waitFor(() => {
  //     expect(console.log).toHaveBeenCalledTimes(2);
  //     expect(console.log.mock.calls[0][0]).toBe("Email déjà existant");
  //     console.log.mockRestore();
  //   });
  // });
});
