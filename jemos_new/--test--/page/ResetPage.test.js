import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { apiUrl } from "../../src/config";
import MockAdapter from "axios-mock-adapter";
import ResetPage from "../../src/components/login/password/ResetPage";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/map/gpx/Resources", () => ({
  USER_ROUTE: "/user/",
}));

describe("ResetPage", () => {
  let mockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  test("successful reset password", () => {
    jest.spyOn(console, "log");
    const mockUserId = "123";
    const mockOldPassword = "oldPassword";
    const mockNewPassword = "newPassword";

    mockAdapter
      .onGet(apiUrl + "/user", { params: { email: "test@example.com" } })
      .reply(200, { _id: mockUserId, password: mockOldPassword });

    render(
      <Router>
        <ResetPage email="test@example.com" />
      </Router>
    );

    const newPasswordInput = screen.getByPlaceholderText(
      i18n.t("saisirMdpPlaceholder")
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      i18n.t("confirmPwdPlaceholder")
    );
    const submitButton = screen.getByText(i18n.t("send"));

    fireEvent.change(newPasswordInput, { target: { value: mockNewPassword } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: mockNewPassword },
    });

    fireEvent.click(submitButton);
    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: Mot de passe réinitialisé avec succès"
      );
    });
  });

  test("error password no match", () => {
    render(
      <Router>
        <ResetPage email="test@example.com" />
      </Router>
    );

    const newPasswordInput = screen.getByPlaceholderText(
      i18n.t("saisirMdpPlaceholder")
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      i18n.t("confirmPwdPlaceholder")
    );
    const submitButton = screen.getByText(i18n.t("send"));

    fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentPassword" },
    });

    fireEvent.click(submitButton);

    expect(screen.getByText(i18n.t("samePwdTwice"))).toBeInTheDocument();
  });

  test("error, new = old password", () => {
    jest.spyOn(console, "log");
    const mockUserId = "123";
    const mockOldPassword = "oldPassword";

    mockAdapter
      .onGet(apiUrl + "/user", { params: { email: "test@example.com" } })
      .reply(200, { _id: mockUserId, password: mockOldPassword });

    render(
      <Router>
        <ResetPage email="test@example.com" />
      </Router>
    );

    const newPasswordInput = screen.getByPlaceholderText(
      i18n.t("saisirMdpPlaceholder")
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      i18n.t("confirmPwdPlaceholder")
    );
    const submitButton = screen.getByText(i18n.t("send"));

    fireEvent.change(newPasswordInput, { target: { value: mockOldPassword } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: mockOldPassword },
    });

    fireEvent.click(submitButton);
    waitFor(() => {
      expect(
        screen.getByText(
          "Merci de choisir un mot de passe différent de l'ancien."
        )
      ).toBeInTheDocument();
    });
  });
});
