import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DropDownPersonnalSpace from "../../../src/components/home/DropDownPersonnalSpace";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../../src/components/util/ThemeSelector", () => {
  return jest.fn(() => <div>ThemeSelector</div>);
});

describe("DropDownPersonnalSpace", () => {
  const props = {
    setVisibleComponent: jest.fn(),
    disconnectUser: jest.fn(),
    avatar: "https://example.com/avatar.png",
    userData: {
      avatar: "https://example.com/avatar.png",
    },
  };

  test("renders correctly with avatar", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const avatarImage = screen.getByAltText("Avatar de l'utilisateur");
    expect(avatarImage).toBeInTheDocument();
  });

  test("renders correctly without avatar", () => {
    const noAvatarProps = { ...props, avatar: "" };
    render(<DropDownPersonnalSpace {...noAvatarProps} />);

    const avatarButton = screen.getByLabelText("MySpace");
    expect(avatarButton).toBeInTheDocument();
  });

  test("clicking on Mes informations button calls setShowMyProfile", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const mesInformationsButton = screen.getByLabelText("Mes informations");
    fireEvent.click(mesInformationsButton);

    expect(props.setVisibleComponent).toHaveBeenCalledWith("MyProfile");
  });

  test("clicking on Mon adresse de facturation button calls setShowBillingAdress", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const monAdresseDeFacturationButton = screen.getByLabelText(
      "Mes adresses de facturation"
    );
    fireEvent.click(monAdresseDeFacturationButton);

    expect(props.setVisibleComponent).toHaveBeenCalledWith("BillingAdress");
  });

  test("clicking on Mes abonnements button calls setShowSubscription", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const mesAbonnementsButton = screen.getByLabelText("Subscriptions");
    fireEvent.click(mesAbonnementsButton);

    expect(props.setVisibleComponent).toHaveBeenCalledWith("Subscriptions");
  });

  test("clicking on Mes factures button calls setShowInvoices", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const mesFacturesButton = screen.getByLabelText("Invoices");
    fireEvent.click(mesFacturesButton);

    expect(props.setVisibleComponent).toHaveBeenCalledWith("Invoices");
  });

  test("clicking on Ma carte de crédit button calls setShowCreditCard", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const maCarteDeCreditButton = screen.getByLabelText("Card");
    fireEvent.click(maCarteDeCreditButton);
    expect(props.setVisibleComponent).toHaveBeenCalledWith("CreditCard");
  });

  test("clicking on Contact button calls setShowContact", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const contactButton = screen.getByLabelText("Contact");
    fireEvent.click(contactButton);

    expect(props.setVisibleComponent).toHaveBeenCalledWith("Contact");
  });

  test("clicking on Déconnexion button calls disconnectUser", () => {
    render(<DropDownPersonnalSpace {...props} />);

    const deconnexionButton = screen.getByText(i18n.t("logOut"));
    fireEvent.click(deconnexionButton);

    expect(props.disconnectUser).toHaveBeenCalled();
  });
});
