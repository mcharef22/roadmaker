import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MarkerScreen from "../../src/components/screens/marker/MarkerScreen";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));
jest.mock("../../src/components/map/MapWithMarker", () => ({
  markerTypes: {
    origin: "mock-origin",
    destination: "mock-destination",
  },
}));

jest.mock("../../src/components/screens/marker/MarkerEditionForm", () => {
  return function MockMarkerEditionForm(props) {
    return <div>Mock MarkerEditionForm</div>;
  };
});

jest.mock("../../src/components/screens/marker/MarkerInfos", () => {
  return function MockMarkerInfos(props) {
    return <div>Mock MarkerInfos</div>;
  };
});

describe("MarkerScreen", () => {
  const mockHandleMarkerDelete = jest.fn();
  const mockSetEditing = jest.fn();
  const mockSetMarkers = jest.fn();
  const marker = {
    id: "1",
    type: "some-type",
  };
  const markers = [];
  const projectDatas = {};
  const selectedMarkerId = "1";

  beforeEach(() => {
    mockHandleMarkerDelete.mockClear();
    mockSetEditing.mockClear();
    mockSetMarkers.mockClear();
  });

  it("call handleMarkerDelete when delete button is clicked", () => {
    const { getByText } = render(
      <MarkerScreen
        marker={marker}
        markers={markers}
        selectedMarkerId={selectedMarkerId}
        handleMarkerDelete={mockHandleMarkerDelete}
        projectDatas={projectDatas}
        setEditedSubType={() => {}}
        setMarkers={mockSetMarkers}
      />,
    );

    const deleteButton = getByText(i18n.t("delete"));
    fireEvent.click(deleteButton);

    expect(mockHandleMarkerDelete).toHaveBeenCalledWith(marker.id, undefined);
  });
});
