import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MapBoxSize from "../../src/components/map/mapBox/MapBoxSize";

describe("MapBoxSize", () => {
  test("call setMapDimensions with the correct dimensions when the range input is changed", () => {
    const setMapDimensionsMock = jest.fn();
    const { getByLabelText } = render(
      <MapBoxSize zoom={50} setMapDimensions={setMapDimensionsMock} />,
    );

    const rangeInput = getByLabelText("input-size");
    fireEvent.change(rangeInput, { target: { value: 96 } });

    expect(setMapDimensionsMock).toHaveBeenCalledTimes(1);
    expect(setMapDimensionsMock).toHaveBeenCalledWith({
      height: "96%",
      width: "96%",
    });
  });
});
