import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Connexion from "../../src/components/login/Connexion";
import { BrowserRouter as Router } from "react-router-dom";
import { apiUrl } from "../../src/config";
import bcrypt from "bcrypt";
import i18n from "i18next";
// Définir la langue à utiliser dans vos tests
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/login/Inscription", () => ({}));
jest.mock("../../src/components/PaletteMaker", () => ({}));
jest.mock("../../src/components/home/Home", () => {
  return () => <div>composant</div>;
});
jest.mock("../../src/components/login/Root", () => ({}));
jest.mock("../../src/components/map/gpx/Resources", () => ({
  USERS_ROUTE: "/users",
  USER_ROUTE: "/user/",
}));
describe("Connexion component", () => {
  let mockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.reset();
  });
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
  test("connexion reussi et le user est confirmé", async () => {
    jest.spyOn(console, "log");

    const mockUser = {
      email: "testuser@example.com",
      password: bcrypt.hashSync("testpassword", bcrypt.genSaltSync(10)),
      confirmed: true,
    };

    mockAdapter.onGet(apiUrl + "/users").reply(200, [mockUser]);

    const { getByText, getByLabelText } = render(
      <Router>
        <Connexion />
      </Router>
    );

    const loginInput = getByLabelText("Identifiant");
    const passwordInput = getByLabelText("Mot de passe");
    fireEvent.change(loginInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    const submitButton = getByText(i18n.t("logIn"));
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: User exist");
      expect(console.log).toHaveBeenCalledWith(
        "jest: User exist and confirmed"
      );
      expect(console.log).toHaveBeenCalledTimes(2);
      console.log.mockRestore();
    });
  });

  test("connexion reussi et le user n'est pas confirmé", async () => {
    jest.spyOn(console, "log");

    const mockUser = {
      email: "testuser@example.com",
      password: bcrypt.hashSync("testpassword", bcrypt.genSaltSync(10)),
      confirmed: false,
    };

    mockAdapter.onGet(apiUrl + "/users").reply(200, [mockUser]);

    const { getByText, getByLabelText } = render(
      <Router>
        <Connexion />
      </Router>
    );

    const loginInput = getByLabelText("Identifiant");
    const passwordInput = getByLabelText("Mot de passe");
    fireEvent.change(loginInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    const submitButton = getByText(i18n.t("logIn"));
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: User exist");
      console.log.mockRestore();
    });
  });

  test("connexion échoué ", async () => {
    jest.spyOn(console, "log");

    mockAdapter.onGet(apiUrl + "/users").reply(200, []);

    const { getByText, getByLabelText } = render(
      <Router>
        <Connexion />
      </Router>
    );

    const loginInput = getByLabelText("Identifiant");
    const passwordInput = getByLabelText("Mot de passe");
    fireEvent.change(loginInput, {
      target: { value: "nonexistentuser@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    const submitButton = getByText(i18n.t("logIn"));
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: User doesn't exist");
      console.log.mockRestore();
    });
  });
});
