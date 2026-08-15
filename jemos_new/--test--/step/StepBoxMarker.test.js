import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StepBoxMarker from "../../src/components/map/stepBox/StepBoxMarker";

describe("StepBoxMarker", () => {
  test("handles marker click ", () => {
    const selectedMarker = 1;
    const marker = { id: 2, title: "Test Marker" };
    const handleMarkerClick = jest.fn();
    const setSelectedMarker = jest.fn();

    const { getByText } = render(
      <StepBoxMarker
        selectedMarker={selectedMarker}
        marker={marker}
        handleMarkerClick={handleMarkerClick}
        setSelectedMarker={setSelectedMarker}
      />
    );

    fireEvent.click(getByText("Test Marker"));

    expect(handleMarkerClick).toHaveBeenCalledWith(2);
    expect(setSelectedMarker).toHaveBeenCalledWith(2);
  });
});
