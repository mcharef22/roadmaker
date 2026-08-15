import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MarkerEditionForm from "../../src/components/screens/marker/MarkerEditionForm";
import UserContext from "../../src/UserContext";

import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock(
  "../../src/components/screens/marker/StructureMarkerForm",
  () => ({})
);
jest.mock(
  "../../src/components/screens/marker/InformationMarkerForm",
  () => ({})
);
jest.mock(
  "../../src/components/screens/marker/TouristicMarkerForm",
  () => ({})
);
jest.mock("../../src/components/screens/marker/CheckBoxAudio", () => ({}));
jest.mock("../../src/components/map/MapWithMarker", () => ({
  markerTypes: {
    origin: "origin",
    destination: "destination",
    step: "step",
    navigation: "navigation",
    information: "information",
    touristic: "touristic",
    structure: "structure",
  },
}));
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
}));

describe("MarkerEditionForm", () => {
  test("renders form with input fields", () => {
    // Mock props
    const props = {
      marker: {
        id: 1,
        title: "",
        audio: ["audio1"],
        image: ["image1"],
        video: ["video1"],
        iconImage: "iconImage1",
        iconName: "iconNAme1",
        imageName: ["imageName1"],
        videoName: ["videoName1"],
        audioName: ["audioName1"],
        distanceToMarker: 1,
        checkAudio: true,
        checkAcces: "gratuit",
        markerToDownload: "",
        resourceArray: ["imageName1", "imageName2"],
        mainResource: ["imageName1"],
      },
      selectedMarkerId: "123",
      markers: [],
      setEditing: jest.fn(),
      projectDatas: {},
      setEditedSubType: jest.fn(),
    };
    const mockedUserContext = {
      iconIndexArray: [],
      setIconIndexArray: jest.fn(),
    };
    render(
      <UserContext.Provider value={mockedUserContext}>
        <MarkerEditionForm {...props} />
      </UserContext.Provider>
    );

    expect(screen.getByText(i18n.t("title"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("description"))).toBeInTheDocument();
    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByLabelText("btn-enregistrer")).toBeInTheDocument();

    // You can continue testing for other input fields and elements in the form
  });

  test("calls saveMarkerInfos when the form is submitted", () => {
    const saveMarkerInfos = jest.fn();
    jest.spyOn(console, "log");
    const props = {
      marker: {
        id: 1,
        title: "",
        audio: ["audio1"],
        image: ["image1"],
        video: ["video1"],
        iconImage: "iconImage1",
        iconName: "iconNAme1",
        imageName: ["imageName1"],
        videoName: ["videoName1"],
        audioName: ["audioName1"],
        distanceToMarker: 1,
        checkAudio: true,
        checkAcces: "gratuit",
        markerToDownload: "",
        resourceArray: ["imageName1", "imageName2"],
        mainResource: ["imageName1"],
      },
      selectedMarkerId: "1",
      markers: [{ id: 1 }],
      setEditing: jest.fn(),
      projectDatas: {},
      setEditedSubType: jest.fn(),
      saveMarkerInfos: saveMarkerInfos,
    };

    const { getByLabelText } = render(
      <UserContext.Provider
        value={{ iconIndexArray: [], setIconIndexArray: jest.fn() }}
      >
        <MarkerEditionForm {...props} />
      </UserContext.Provider>
    );

    // Simule le remplissage du formulaire
    const titleInput = screen.getByLabelText("input-titre");
    fireEvent.change(titleInput, { target: { value: "Nouveau titre" } });

    const descriptionInput = screen.getByLabelText("input-description");
    fireEvent.change(descriptionInput, {
      target: { value: "Nouvelle description" },
    });
    const distanceInput = screen.getByLabelText("input-distance");
    fireEvent.change(distanceInput, {
      target: { value: 2 },
    });

    const submitButton = getByLabelText("btn-enregistrer");
    fireEvent.click(submitButton);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: Appeller la fonction saveMarkerInfos"
      );
      console.log.mockRestore();
    });
  });
});
