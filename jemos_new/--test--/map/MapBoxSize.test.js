import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MapBoxSize from "../../src/components/map/mapBox/MapBoxSize";

describe("MapBoxSize", () => {
  test("call setMapDimensions with the correct dimensions when the range input is changed", () => {
    const setMapDimensionsMock = jest.fn();
    const { getByLabelText } = render(
      <MapBoxSize zoom={1000} setMapDimensions={setMapDimensionsMock} />
    );

    const rangeInput = getByLabelText("input-size");
    fireEvent.change(rangeInput, { target: { value: 1200 } });

    expect(setMapDimensionsMock).toHaveBeenCalledTimes(1);
    expect(setMapDimensionsMock).toHaveBeenCalledWith({
      height: "1200px",
      width: "1200px",
    });
  });
});
