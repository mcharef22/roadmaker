import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BillingAddressForm from "../../../src/components/user/billingAddress/BillingAddressForm";
import i18n from "i18next";
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


describe("BillingAddressForm Component", () => {
  const handleSubmit = jest.fn();
  const setIsProfessional = jest.fn();
  const setCorporateName = jest.fn();
  const setSiret = jest.fn();
  const setFirstAndLastName = jest.fn();
  const setAddress = jest.fn();
  const setAdditionalAddress = jest.fn();
  const setCity = jest.fn();
  const setZipCode = jest.fn();
  const setCountry = jest.fn();

  beforeEach(() => {
    render(
      <BillingAddressForm
        handleSubmit={handleSubmit}
        userData={{}}
        setIsProfessional={setIsProfessional}
        isProfessional={true}
        corporateName=""
        setCorporateName={setCorporateName}
        siret=""
        setSiret={setSiret}
        firstAndLastName=""
        setFirstAndLastName={setFirstAndLastName}
        address=""
        setAddress={setAddress}
        additionalAddress=""
        setAdditionalAddress={setAdditionalAddress}
        city=""
        setCity={setCity}
        zipCode=""
        setZipCode={setZipCode}
        country=""
        setCountry={setCountry}
      />
    );
  });

  it("renders BillingAddressForm component when user is professional", () => {
    expect(
      screen.getByText(i18n.t("newAddress"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("professional")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Raison sociale")).toBeInTheDocument();
    expect(screen.getByLabelText("SIRET")).toBeInTheDocument();
    expect(screen.getByLabelText("firstAndLastName")).toBeInTheDocument();
    expect(screen.getByLabelText("Adresse")).toBeInTheDocument();
    expect(screen.getByLabelText("Complément d'adresse")).toBeInTheDocument();
    expect(screen.getByLabelText("Ville")).toBeInTheDocument();
    expect(screen.getByLabelText("Code Postal")).toBeInTheDocument();
    expect(screen.getByLabelText("Pays")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Enregistrer-informations-button")
    ).toBeInTheDocument();
  });

  it("toggles the professional status when the checkbox is clicked", () => {
    const checkbox = screen.getByLabelText("professional");
    fireEvent.click(checkbox);
    expect(setIsProfessional).toHaveBeenCalledTimes(1);
    expect(setIsProfessional).toHaveBeenCalledWith(true);
  });
});
