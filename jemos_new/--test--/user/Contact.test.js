import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import UserContact from "../../src/components/user/Contact";
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

jest.mock("../../src/components/user/billingAddress/BillingAddressForm", () => {
    return jest.fn(() => null);
});

describe("UserContact", () => {
  const userData = {
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render the form correctly", () => {
    const { getByLabelText, getByText } = render(
      <UserContact userData={userData} />
    );

    expect(getByLabelText("input-subject")).toBeInTheDocument();
    expect(getByLabelText("input-message")).toBeInTheDocument();
    expect(getByText(i18n.t("send"))).toBeInTheDocument();
  });

  test("should send an email when the form is submitted", async () => {
    const { getByLabelText, getByText } = render(
      <UserContact userData={userData} />
    );

    const subjectInput = getByLabelText("input-subject");
    const messageInput = getByLabelText("input-message");
    const submitButton = getByText(i18n.t("send"));

    fireEvent.change(subjectInput, { target: { value: "Test subject" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/email"),
        {
          email: userData.email,
          subject: "Nouveau message de la part d'un utilisateur",
          replyTo: userData.email,
          message: expect.any(String),
        }
      );
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/email/user"),
        {
          email: userData.email,
          subject: "Confirmation de l'envoi de votre message",
          message: expect.any(String),
        }
      );
    });
  });

  test("should show an error message if the email fails to send", async () => {
    // Simuler une erreur lors de l'appel à axios.post
    axios.post.mockRejectedValueOnce(
      new Error("Une erreur est survenue lors de l'envoi de votre message.")
    );

    const { getByLabelText, getByText } = render(
      <UserContact userData={userData} />
    );

    const subjectInput = getByLabelText("input-subject");
    const messageInput = getByLabelText("input-message");
    const submitButton = getByText(i18n.t("send"));

    fireEvent.change(subjectInput, { target: { value: "Test subject" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(
        getByText(i18n.t("errorMessage"))
      ).toBeInTheDocument();
    });
  });
});
