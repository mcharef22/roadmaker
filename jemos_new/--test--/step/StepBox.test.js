import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StepBox from "../../src/components/map/stepBox/StepBox";

describe("StepBox", () => {
  test("renders title", () => {
    const { getByText } = render(
      <StepBox
        markers={[]}
        handleMarkerClick={() => {}}
        titleOfProject="Project Title"
      />
    );
    const title = getByText("Project Title");
    expect(title).toBeInTheDocument();
  });

  test("shows marker list when project icon is clicked", () => {
    jest.spyOn(console, "log");
    const { getByLabelText } = render(
      <StepBox
        markers={[]}
        handleMarkerClick={() => {}}
        titleOfProject="Project Title"
      />
    );
    const projectIcon = getByLabelText("input-showMarkers");
    fireEvent.click(projectIcon);

    expect(console.log).toHaveBeenCalledWith(
      "jest: Afficher la liste des markers"
    );
  });
});
