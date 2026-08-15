import React from "react";
import { render } from "@testing-library/react";
import Indice from "../../src/components/screens/Indice";
import UserContext from "../../src/UserContext";

jest.mock("../../src/components/map/gpx/Resources", () => ({}));
jest.mock("../../src/components/screens/marker/MarkerScreen", () => {
  return function MockMarkerScreen() {
    return <div>Mock MarkerScreen</div>;
  };
});

describe("Indice", () => {
  it("render MarkerScreen ", () => {
    const props = {
      projectDatas: {},
      setEditedSubType: jest.fn(),
      setMarkers: jest.fn(),
    };

    const mockContextValue = {
      markers: [{ id: 1 }],
      selectedMarkerId: 1,
      handleMarkerDelete: jest.fn(),
    };

    const { getByText } = render(
      <UserContext.Provider value={mockContextValue}>
        <Indice {...props} />
      </UserContext.Provider>
    );

    const markerScreenElement = getByText("Mock MarkerScreen");
    expect(markerScreenElement).toBeInTheDocument();
  });
});
