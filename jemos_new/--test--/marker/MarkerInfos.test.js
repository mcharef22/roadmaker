import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MarkerInfos from "../../src/components/screens/marker/MarkerInfos";
import i18n from "i18next";

// Define the language to use in your tests
const testLanguage = "fr";

// Mock the translation function
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/screens/marker/TouristicMarker", () => {
  return function MockTouristicMarker(props) {
    return <div>Mock TouristicMarker</div>;
  };
});

jest.mock("../../src/components/map/MapWithMarker", () => ({
  markerTypes: {
    origin: "origin",
    destination: "destination",
    step: "step",
    navigation: "navigation",
    information: "information",
    touristic: "touristic",
    structure: "structure",
    quiz: "quiz",
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
  DISTANCE_TO_TRIGGER_AUDIO: "100",
}));

describe("MarkerInfos", () => {
  it("renders the subType label", () => {
    const marker = {
      type: "information",
      title: "Marker Title",
      description: "Marker Description",
      subType: "subtype",
    };
    const setEditing = jest.fn();
    const projectDatas = {};

    render(
      <MarkerInfos
        marker={marker}
        setEditing={setEditing}
        projectDatas={projectDatas}
      />
    );

    const subTypeLabel = screen.getByText("type : subtype");

    expect(subTypeLabel).toBeInTheDocument();
  });

  it("renders the distance label for certain marker types", () => {
    const marker = {
      type: "information",
      title: "Marker Title",
      description: "Marker Description",
      distanceToMarker: "160",
    };
    const setEditing = jest.fn();
    const projectDatas = {};

    render(
      <MarkerInfos
        marker={marker}
        setEditing={setEditing}
        projectDatas={projectDatas}
      />
    );

    const distanceLabel = screen.getByText("Distance : 160");
    expect(distanceLabel).toBeInTheDocument();
  });

  it("does not render the distance label for step marker", () => {
    const marker = {
      type: "step",
      title: "Marker Title",
      description: "Marker Description",
    };
    const setEditing = jest.fn();
    const projectDatas = {};

    const { queryByText } = render(
      <MarkerInfos
        marker={marker}
        setEditing={setEditing}
        projectDatas={projectDatas}
      />
    );

    const distanceLabel = queryByText("Distance :");
    expect(distanceLabel).toBeNull();
  });
});
