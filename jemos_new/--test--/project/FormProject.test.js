import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import ProjectForm from "../../src/components/ProjectForm";
import { apiUrl } from "../../src/config";
import i18n from "i18next";
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/util/ProjectNameError", () => ({}));
jest.mock("../../src/components/PaletteMaker", () => {
  return () => <div>composant</div>;
});
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
  PROJECT_ROUTE: "/project",
}));

describe("FormProject component", () => {
  const responseData = {
    _id: "647d91549ae7a73a460201a1",
    name: "test",
    projectType: "test",
    customIndicationsEdited: false,
    POIs: [
      "647d918c9ae7a73a460201a6",
      "647d9b534172ca342b87a6a7",
      "647d9c744172ca342b87a6c1",
      "647daae74172ca342b87a6f9",
    ],
    user: null,
    dateOfCreation: 1685950804036,
    __v: 0,
    customNavigationPoints: "[]",
    polyline_result: "",
  };
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it("create a project successfully", async () => {
    jest.spyOn(console, "log");
    const userData = { _id: "user123" };
    const checkName = jest.fn();
    const checkEmptyName = jest.fn();
    const checkEmptyType = jest.fn();

    const mock = new MockAdapter(axios);

    mock
      .onGet(apiUrl + "/project/user/" + userData._id)
      .reply(200, responseData);

    const { getByLabelText, getByText } = render(
      <ProjectForm
        userData={userData}
        checkName={checkName}
        checkEmptyName={checkEmptyName}
        checkEmptyType={checkEmptyType}
      />
    );

    const projectNameInput = getByLabelText("Nom du parcours");
    const projectTypeInput = getByLabelText("car");
    const createProjectButton = getByText(i18n.t("createCourse"));

    fireEvent.change(projectNameInput, { target: { value: "Test Project" } });
    fireEvent.click(projectTypeInput);
    fireEvent.click(createProjectButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: Création réussite");
      console.log.mockRestore();
    });
  });

  it("error empty project type", async () => {
    jest.spyOn(console, "log");
    const userData = { _id: "user123" };
    const checkName = jest.fn();
    const checkEmptyName = jest.fn();
    const checkEmptyType = jest.fn();
    const { getByLabelText, getByText } = render(
      <ProjectForm
        userData={userData}
        checkName={checkName}
        checkEmptyName={checkEmptyName}
        checkEmptyType={checkEmptyType}
      />
    );

    const mock = new MockAdapter(axios);

    mock
      .onGet(apiUrl + "/project/user/" + userData._id)
      .reply(200, responseData);

    const projectNameInput = getByLabelText("Nom du parcours");
    const createProjectButton = getByText(i18n.t("createCourse"));

    fireEvent.change(projectNameInput, { target: { value: "Test Project" } });
    fireEvent.click(createProjectButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: Empty type");
      console.log.mockRestore();
    });
  });

  it("error empty project name", async () => {
    jest.spyOn(console, "log");
    const userData = { _id: "user123" };
    const checkName = jest.fn();
    const checkEmptyName = jest.fn();
    const checkEmptyType = jest.fn();
    const { getByLabelText, getByText } = render(
      <ProjectForm
        userData={userData}
        checkName={checkName}
        checkEmptyName={checkEmptyName}
        checkEmptyType={checkEmptyType}
      />
    );

    const mock = new MockAdapter(axios);

    mock
      .onGet(apiUrl + "/project/user/" + userData._id)
      .reply(200, responseData);

    const projectTypeInput = getByLabelText("car");
    const createProjectButton = getByText(i18n.t("createCourse"));

    fireEvent.click(projectTypeInput);
    fireEvent.click(createProjectButton);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: Empty name");
      console.log.mockRestore();
    });
  });
});
