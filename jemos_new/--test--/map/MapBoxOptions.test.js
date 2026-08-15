import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MapBoxOptions from "../../src/components/map/mapBox/MapBoxOptions";

describe("MapBoxOptions", () => {
  test("setOptimizeWaypoints with the correct value when the optimization checkbox is toggled", () => {
    const setOptimizeWaypointsMock = jest.fn();
    const { getByLabelText } = render(
      <MapBoxOptions setOptimizeWaypoints={setOptimizeWaypointsMock} />
    );

    const optimizationCheckbox = getByLabelText("Optimisation d'itinéraire");
    fireEvent.click(optimizationCheckbox);

    expect(setOptimizeWaypointsMock).toHaveBeenCalledTimes(1);
    expect(setOptimizeWaypointsMock).toHaveBeenCalledWith(true);
  });

  test(" call setAvoidHighways with the correct value when the avoid highways checkbox is toggled", () => {
    const setAvoidHighwaysMock = jest.fn();
    const { getByLabelText } = render(
      <MapBoxOptions setAvoidHighways={setAvoidHighwaysMock} />
    );

    const avoidHighwaysCheckbox = getByLabelText("Éviter les autoroutes");
    fireEvent.click(avoidHighwaysCheckbox);

    expect(setAvoidHighwaysMock).toHaveBeenCalledTimes(1);
    expect(setAvoidHighwaysMock).toHaveBeenCalledWith(true);
  });

  test("call setPoilLabels with the correct value when the label toggle checkbox is toggled", () => {
    const setPoilLabelsMock = jest.fn();
    const { getByLabelText } = render(
      <MapBoxOptions
        distance=""
        duration=""
        showAllLabels=""
        hideAllLabels=""
        optimizeWaypoints=""
        setOptimizeWaypoints=""
        avoidHighways=""
        setAvoidHighways=""
        setPoilLabels={setPoilLabelsMock}
      />
    );

    const labelToggleCheckbox = getByLabelText(
      "Afficher les commerces et les stations"
    );
    fireEvent.click(labelToggleCheckbox);

    expect(setPoilLabelsMock).toHaveBeenCalledTimes(1);
    expect(setPoilLabelsMock).toHaveBeenCalledWith(expect.any(String));
  });
});
