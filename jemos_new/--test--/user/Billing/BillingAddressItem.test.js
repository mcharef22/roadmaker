import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BillingAddressItem from "../../../src/components/user/billingAddress/BillingAddressItem";
import BillingAddressForm from "../../../src/components/user/billingAddress/BillingAddressForm";
import i18n from "i18next";
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

describe("BillingAddressItem Component", () => {
  const billingAddresses = [
    {
      _id: "address1",
      firstAndLastName: "John Doe",
      corporateName: "ABC Company",
      siret: "123456789",
      address: "123 Main St",
      additionalAddress: "Apt 4B",
      zipCode: "12345",
      city: "City",
      country: "Country",
    },
    // Add more test data if needed
  ];

  const handleDelete = jest.fn();
  const handleUpdate = jest.fn();
  const setIsModified = jest.fn();
  const handleCancel = jest.fn();
  const setEditingValues = jest.fn();
  const setInvoiceBA = jest.fn();
  const handleSetInvoiceBA = jest.fn();

  beforeEach(() => {
    render(
      <BillingAddressItem
        billingAddresses={billingAddresses}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        isModified={false}
        setIsModified={setIsModified}
        handleCancel={handleCancel}
        editingValues={{}}
        setEditingValues={setEditingValues}
        setInvoiceBA={setInvoiceBA}
        invoiceBA={null}
        userData={{}}
        handleSetInvoiceBA={handleSetInvoiceBA}
        selectedBillingAddress={null}
      />
    );
  });

  it("renders BillingAddressItem component with correct data", () => {
    expect(screen.getByText(i18n.t("billingAddress") + " 1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("ABC Company")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("Apt 4B")).toBeInTheDocument();
    expect(screen.getByText("City, 12345")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
});

  it("renders BillingAddressItem component with correct buttons", () => {
    expect(screen.getByLabelText("Modif-button")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete-button")).toBeInTheDocument();
    expect(screen.getByLabelText("Use-button")).toBeInTheDocument();
  });
});
