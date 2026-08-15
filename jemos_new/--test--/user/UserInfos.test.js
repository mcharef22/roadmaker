import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import UserInfos from "../../src/components/user/UserInfos";
import { apiUrl } from "../../src/config";
import i18n from "i18next";
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

const mock = new MockAdapter(axios);

jest.mock("axios");

jest.mock("../../src/components/map/gpx/Resources", () => ({
  parcoursTypes: {
    car: "car_mock",
    cycle: "cycle_mock",
    pedestrian: "pedestrian_mock",
    fast_forward: "fast_forward_mock",
  },
  projectTypes: {
    type1: "type1_mock",
    type2: "type2_mock",
    type3: "type3_mock",
  },
  packValue: {
    standard: "Standard",
    premium: "Premium",
  },
}));

describe("UserInfos", () => {
  const initialData = {
    userName: "John Doe",
    email: "johndoe@example.com",
  };

  const mockFunctions = {
    setIsEditing: jest.fn(),
    setUserName: jest.fn(),
    setEmail: jest.fn(),
    setShowPassword: jest.fn(),
    setPassword: jest.fn(),
    handleAnnuler: jest.fn(),
    handleValider: jest.fn(),
  };

  test("should render user information", () => {
    render(<UserInfos isEditing={false} {...initialData} {...mockFunctions} />);

    const nameElement = screen.getByText(initialData.userName);
    const emailElement = screen.getByText(initialData.email);
    const passwordElement = screen.getByText("••••••••••••");
    const editButton = screen.getByText(i18n.t("edit"));

    expect(nameElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });

  test("to edit form", () => {
    render(<UserInfos isEditing={true} {...initialData} {...mockFunctions} />);

    const nameInput = screen.getByDisplayValue(initialData.userName);
    const emailInput = screen.getByDisplayValue(initialData.email);
    const passwordInput = screen.getByPlaceholderText(i18n.t("writeNewPwd"));
    const cancelButton = screen.getByText(i18n.t("cancel"));
    const validateButton = screen.getByText(i18n.t("accept"));
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(validateButton).toBeInTheDocument();
  });

  test("cancel editing", () => {
    const { rerender } = render(
      <UserInfos isEditing={true} {...initialData} {...mockFunctions} />
    );

    const cancelButton = screen.getByText(i18n.t("cancel"));
    fireEvent.click(cancelButton);

    rerender(
      <UserInfos isEditing={false} {...initialData} {...mockFunctions} />
    );

    const nameElement = screen.getByText(initialData.userName);
    const emailElement = screen.getByText(initialData.email);
    const passwordElement = screen.getByText("••••••••••••");

    expect(nameElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
  });

  test("validate modifications", () => {
    render(<UserInfos isEditing={true} {...initialData} {...mockFunctions} />);

    const nameInput = screen.getByDisplayValue(initialData.userName);
    const emailInput = screen.getByDisplayValue(initialData.email);
    const passwordInput = screen.getByPlaceholderText(i18n.t("writeNewPwd"));

    fireEvent.change(nameInput, { target: { value: "New Name" } });
    fireEvent.change(emailInput, { target: { value: "newemail@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });

    const validateButton = screen.getByText(i18n.t("accept"));
    fireEvent.click(validateButton);

    const nameElement = screen.getByDisplayValue("New Name");
    const emailElement = screen.getByDisplayValue("newemail@example.com");
    const passwordElement = screen.getByDisplayValue("newpassword123");

    expect(nameElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
  });
});
