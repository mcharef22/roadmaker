// StepBoxTouristicMarker.test.js

import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StepBoxTouristicMarker from "../../src/components/map/stepBox/StepBoxTouristicMarker";

describe("StepBoxTouristicMarker", () => {
  test("handles marker click ", () => {
    const selectedMarker = 1;
    const marker = {
      id: 2,
      title: "Test Marker",
      type: "touristic",
      resourceArray: [],
    };
    const handleMarkerClick = jest.fn();
    const setSelectedMarker = jest.fn();
    const handleIconPIClick = jest.fn();
    const showResources = [];

    const { getByText } = render(
      <StepBoxTouristicMarker
        selectedMarker={selectedMarker}
        marker={marker}
        handleMarkerClick={handleMarkerClick}
        setSelectedMarker={setSelectedMarker}
        handleIconPIClick={handleIconPIClick}
        showResources={showResources}
      />
    );

    fireEvent.click(getByText("Test Marker"));

    expect(handleMarkerClick).toHaveBeenCalledWith(2);
    expect(setSelectedMarker).toHaveBeenCalledWith(2);
  });

  test("handles marker icon click ", () => {
    const selectedMarker = 1;
    const marker = {
      id: 3,
      title: "Test Marker",
      type: "touristic",
      resourceArray: [],
    };
    const handleMarkerClick = jest.fn();
    const setSelectedMarker = jest.fn();
    const handleIconPIClick = jest.fn();
    const showResources = [];

    const { getByLabelText } = render(
      <StepBoxTouristicMarker
        selectedMarker={selectedMarker}
        marker={marker}
        handleMarkerClick={handleMarkerClick}
        setSelectedMarker={setSelectedMarker}
        handleIconPIClick={handleIconPIClick}
        showResources={showResources}
      />
    );

    const icon = getByLabelText("input-showRessources");
    fireEvent.click(icon);

    expect(handleIconPIClick).toHaveBeenCalledWith(3);
  });
});
