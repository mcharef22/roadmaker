import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { apiUrl } from "../../src/config";
import MockAdapter from "axios-mock-adapter";
import ForgottenPassword from "../../src/components/login/password/ForgottenPassword";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/map/gpx/Resources", () => ({}));

describe("ForgottenPassword", () => {
  let mockAdapter;

  beforeAll(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  //   test("user exist", async () => {
  //     jest.spyOn(console, "log");
  //     const existingUser = { ema"existing@example.com" };
  //     mockAdapter.onGet(apiUrl + "/users").reply(200, [existingUser]);
  //     render(
  //       <Router>
  //         <ForgotPassword />
  //       </Router>
  //     );

  //     const emailInput = screen.getByLabelText(
  //       "Merci de saisir votre adresse mail"
  //     );
  //     const submitButton = screen.getByText("Envoyer");

  //     fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
  //     fireEvent.click(submitButton);

  //     await waitFor(() => {
  //       expect(console.log).toHaveBeenCalledWith("Email envoyé");
  //       console.log.mockRestore();
  //     });
  //   });

  test("user doesn't exist", () => {
    jest.spyOn(console, "log");
    mockAdapter.onGet(apiUrl + "/users").reply(200, []);

    render(
      <Router>
        <ForgottenPassword />
      </Router>
    );

    const emailInput = screen.getByLabelText(
      "Merci de saisir votre adresse mail"
    );
    const submitButton = screen.getByText(i18n.t("send"));

    fireEvent.change(emailInput, {
      target: { value: "nonexisting@example.com" },
    });
    fireEvent.click(submitButton);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: Aucun utilisateur a été trouvé"
      );
      console.log.mockRestore();
    });
  });
});
