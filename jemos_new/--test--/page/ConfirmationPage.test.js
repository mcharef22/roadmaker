import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationPage from "../../src/components/login/ConfirmationPage";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock("../../src/components/map/gpx/Resources", () => ({}));
jest.mock("../../src/components/util/DialogBox", () => jest.fn());

describe("PageConfirmation", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("render of component", () => {
  useLocation.mockReturnValue({
    search: "?confirmed=true&userId=123",
  });
  axios.put.mockResolvedValue();

  render(<ConfirmationPage />);

  const messageConfirmationUser = i18n.t("messageConfirmationUser");
  const sentenceConfirmationUser = i18n.t("sentenceConfirmationUser");
  const continueConnexionPage = i18n.t("continueConnexionPage");

  if (messageConfirmationUser) {
    expect(screen.getByText(messageConfirmationUser)).toBeInTheDocument();
  }
  if (sentenceConfirmationUser) {
    expect(screen.getByText(sentenceConfirmationUser)).toBeInTheDocument();
  }
  if (continueConnexionPage) {
    expect(
      screen.getByRole("button", {
        name: continueConnexionPage,
      })
    ).toBeInTheDocument();
  }
});

  test("error message", () => {
  useLocation.mockReturnValue({
    search: "?confirmed=false",
  });
  axios.put.mockResolvedValue();

  render(<ConfirmationPage />);

  const failureConfirmationUser = i18n.t("failureConfirmationUser");
  const sentenceFailureConfirmationUser = i18n.t("sentenceFailureConfirmationUser");

  if (failureConfirmationUser) {
    expect(screen.getByText(failureConfirmationUser)).toBeInTheDocument();
  }
  if (sentenceFailureConfirmationUser) {
    expect(screen.getByText(sentenceFailureConfirmationUser)).toBeInTheDocument();
  }
});

  test("success message", () => {
    useLocation.mockReturnValue({
      search: "?confirmed=true&userId=123",
    });
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    axios.put.mockResolvedValue();

    render(<ConfirmationPage />);

    const continueButton = screen.getByRole("button", {
      name: i18n.t("continueConnexionPage"),
    });
    fireEvent.click(continueButton);

    expect(navigateMock).toHaveBeenCalledWith("/connexion");
  });
});
