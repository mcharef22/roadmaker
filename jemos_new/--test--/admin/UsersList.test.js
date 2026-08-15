import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { apiUrl } from "../../src/config";
import UsersList from "../../src/components/home/admin/UsersList";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

const mock = new MockAdapter(axios);
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
  USERS_ROUTE: "/users",
  USER_ROUTE: "/user/",
}));

describe("users list component", () => {
  let mockAdapter;
  const mockUsers = [
    {
      _id: "123456789",
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
      projects: "648c68814b66146ce093ba05",
      iconIndexArray: [""],
      confirmed: true,
      admin: true,
      pack: "Premium",
    },
    {
      _id: "123056789",
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "password123",
      projects: "648c68814b66146ce093ba06",
      iconIndexArray: [""],
      confirmed: false,
      admin: false,
      pack: "Standard",
    },
  ];

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.reset();
  });

  test("show users and buttons", async () => {
    mockAdapter.onGet(apiUrl + "/users").reply(200, mockUsers);

    render(<UsersList handleDeleteProject={jest.fn()} />);

    await screen.findByText("John Doe");

    const name1 = screen.getByText("John Doe");
    expect(name1).toBeInTheDocument();
    const email1 = screen.getByText("johndoe@example.com");
    expect(email1).toBeInTheDocument();
    const confirm1 = screen.getByRole("checkbox", {
      name: /confirmValue-0/i,
    });
    expect(confirm1).toBeChecked();
    const admin1 = screen.getByRole("checkbox", {
      name: /adminValue-0/i,
    });
    expect(admin1).toBeChecked();
    const pack1 = screen.getByText("Premium");
    expect(pack1).toBeInTheDocument();

    const name2 = screen.getByText("Jane Smith");
    expect(name2).toBeInTheDocument();
    const email2 = screen.getByText("janesmith@example.com");
    expect(email2).toBeInTheDocument();
    const confirm2 = screen.getByRole("checkbox", {
      name: /confirmValue-1/i,
    });
    expect(confirm2).not.toBeChecked();
    const admin2 = screen.getByRole("checkbox", {
      name: /adminValue-1/i,
    });
    expect(admin2).not.toBeChecked();
    const pack2 = screen.getByText("Standard");
    expect(pack2).toBeInTheDocument();
  });

  test("show users and buttons after click on modifier button", async () => {
    mockAdapter.onGet(apiUrl + "/users").reply(200, mockUsers);

    render(<UsersList handleDeleteProject={jest.fn()} />);

    await screen.findByText("John Doe");

    fireEvent.click(screen.getByTestId("btn-modifier-0"));

    const inputUserName1 = screen.getByLabelText("Name-0");
    expect(inputUserName1.value).toBe("John Doe");

    const inputUserEmail1 = screen.getByLabelText("email-0");
    expect(inputUserEmail1.value).toBe("johndoe@example.com");

    const inputUserConfirmed1 = screen.getByRole("checkbox", {
      name: /confirm-0/i,
    });
    expect(inputUserConfirmed1).toBeChecked();

    const inputUserAdmin1 = screen.getByRole("checkbox", {
      name: /admin-0/i,
    });
    expect(inputUserAdmin1).not.toBeChecked();

    const inputUserPack1 = screen.getByLabelText("pack-0");
    expect(inputUserPack1.value).toBe("Premium");

    fireEvent.click(screen.getByTestId("btn-modifier-1"));

    const inputUserName2 = screen.getByLabelText("Name-1");
    expect(inputUserName2.value).toBe("Jane Smith");

    const inputUserEmail2 = screen.getByLabelText("email-1");
    expect(inputUserEmail2.value).toBe("janesmith@example.com");

    const inputUserConfirmed2 = screen.getByRole("checkbox", {
      name: /confirm-1/i,
    });
    expect(inputUserConfirmed2).not.toBeChecked();

    const inputUserAdmin2 = screen.getByRole("checkbox", {
      name: /admin-1/i,
    });
    expect(inputUserAdmin2).not.toBeChecked();

    const inputUserPack2 = screen.getByLabelText("pack-1");
    expect(inputUserPack2.value).toBe("Standard");
  });

  test("show annuler and Sauvegarder buttons after click on modifier button", async () => {
    mockAdapter.onGet(apiUrl + "/users").reply(200, mockUsers);

    render(<UsersList handleDeleteProject={jest.fn()} />);

    await screen.findByText("John Doe");

    fireEvent.click(screen.getByTestId("btn-modifier-0"));

    const btnSave1 = screen.getByTestId("btn-sauvegarder-0");
    expect(btnSave1).toBeInTheDocument();
    const btnCancel1 = screen.getByTestId("btn-annuler-0");
    expect(btnCancel1).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("btn-modifier-1"));

    const btnSave2 = screen.getByTestId("btn-sauvegarder-1");
    expect(btnSave2).toBeInTheDocument();
    const btnCancel2 = screen.getByTestId("btn-annuler-1");
    expect(btnCancel2).toBeInTheDocument();
  });

  test("save modified user data", async () => {
    mockAdapter.onGet(apiUrl + "/users").reply(200, mockUsers);
    mockAdapter.onPut(apiUrl + "/user/123456789").reply(200, { success: true });

    render(<UsersList handleDeleteProject={jest.fn()} />);

    await screen.findByText("John Doe");

    fireEvent.click(screen.getByTestId("btn-modifier-0"));

    const inputUserName1 = screen.getByLabelText("Name-0");
    fireEvent.change(inputUserName1, { target: { value: "John Smith" } });

    const inputUserEmail1 = screen.getByLabelText("email-0");
    fireEvent.change(inputUserEmail1, {
      target: { value: "johnsmith@example.com" },
    });

    const textAreaUserIcon = screen.getByLabelText("textArea-0");
    fireEvent.change(textAreaUserIcon, {
      target: { value: "PI10000" },
    });
    const inputUserConfirmed1 = screen.getByRole("checkbox", {
      name: /confirm-0/i,
    });
    fireEvent.click(inputUserConfirmed1);

    const inputUserAdmin1 = screen.getByRole("checkbox", {
      name: /admin-0/i,
    });
    fireEvent.click(inputUserAdmin1);

    const inputUserPack1 = screen.getByLabelText("pack-0");
    fireEvent.change(inputUserPack1, {
      target: { value: "Standard" },
    });

    fireEvent.click(screen.getByTestId("btn-sauvegarder-0"));

    await screen.findByText("John Smith");

    const updatedName1 = screen.getByText("John Smith");
    expect(updatedName1).toBeInTheDocument();
    const updatedEmail1 = screen.getByText("johnsmith@example.com");
    expect(updatedEmail1).toBeInTheDocument();
    expect(inputUserAdmin1).toBeChecked();
    expect(inputUserConfirmed1).not.toBeChecked();
    expect(inputUserPack1.value).toBe("Standard");
  });

  test("cancel modification to user data", async () => {
    mockAdapter.onGet(apiUrl + "/users").reply(200, mockUsers);
    mockAdapter.onPut(apiUrl + "/user/123456789").reply(200, { success: true });

    render(<UsersList handleDeleteProject={jest.fn()} />);

    await screen.findByText("John Doe");

    fireEvent.click(screen.getByTestId("btn-modifier-0"));

    const inputUserName1 = screen.getByLabelText("Name-0");
    fireEvent.change(inputUserName1, { target: { value: "John Smith" } });

    const inputUserEmail1 = screen.getByLabelText("email-0");
    fireEvent.change(inputUserEmail1, {
      target: { value: "johnsmith@example.com" },
    });
    const inputUserConfirmed1 = screen.getByRole("checkbox", {
      name: /confirm-0/i,
    });
    fireEvent.click(inputUserConfirmed1);

    const inputUserAdmin1 = screen.getByRole("checkbox", {
      name: /admin-0/i,
    });
    fireEvent.click(inputUserAdmin1);

    const inputUserPack1 = screen.getByLabelText("pack-0");
    fireEvent.change(inputUserPack1, {
      target: { value: "Standard" },
    });

    fireEvent.click(screen.getByTestId("btn-annuler-0"));

    await screen.findByText("John Doe");

    const updatedName1 = screen.getByText("John Doe");
    expect(updatedName1).toBeInTheDocument();
    const updatedEmail1 = screen.getByText("johndoe@example.com");
    expect(updatedEmail1).toBeInTheDocument();
    const updatedConfirmed1 = screen.getByRole("checkbox", {
      name: /confirmValue-0/i,
    });
    const updatedAdmin1 = screen.getByRole("checkbox", {
      name: /adminValue-0/i,
    });
    const updatedPack1 = screen.getByText("Premium");
    expect(updatedPack1).toBeInTheDocument();
    expect(updatedAdmin1).toBeChecked();
    expect(updatedConfirmed1).toBeChecked();
  });

  test("reset user icon index", async () => {
    mockAdapter.onGet(apiUrl + "/users").reply(200, mockUsers);
    mockAdapter.onPut(apiUrl + "/user/123456789").reply(200, { success: true });

    render(<UsersList handleDeleteProject={jest.fn()} />);

    await screen.findByText("John Doe");

    fireEvent.click(screen.getByTestId("btn-reset-0"));

    const confirmResetIndexButton = screen.getByText(i18n.t("resetIconsIndex"));
    expect(confirmResetIndexButton).toBeInTheDocument();

    fireEvent.click(screen.getByText(i18n.t("yes")));

    await screen.findByText("John Doe");

    const updatedName1 = screen.getByText("John Doe");
    expect(updatedName1).toBeInTheDocument();

    // Vérifiez que l'index d'icônes a été réinitialisé
    expect(mockAdapter.history.put.length).toBe(1);
  });
});
