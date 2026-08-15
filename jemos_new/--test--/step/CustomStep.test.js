import React from "react";
import { render, fireEvent, getByTestId, screen } from "@testing-library/react";
import CustomStep from "../../src/components/map/customNavigation/CustomStep";

jest.mock(
  "../../src/components/map/mapBox/mapBoxFeatures/CompileProject",
  () => ({
    translateManeuver: jest.fn(),
  })
);

jest.mock("../../src/components/map/gpx/Resources", () => ({}));

const mockStep = {
  stepNumber: 1,
  instructions: "Test instructions",
  maneuver: "Turn left",
  start_location: "Test location",
  distance: { text: "10 " },
};

describe("CustomStep", () => {
  it("renders correctly the component", () => {
    const { getByTestId, getByText } = render(<CustomStep step={mockStep} />);
    expect(getByTestId("showSteps")).toBeInTheDocument();
    expect(getByText("1. Test instructions")).toBeInTheDocument();
    expect(getByText("10")).toBeInTheDocument();
  });

  it("calls handleDeleteStep when delete button is clicked", () => {
    const handleDeleteStep = jest.fn();
    const { getByText } = render(
      <CustomStep step={mockStep} handleDeleteStep={handleDeleteStep} />
    );

    fireEvent.click(screen.getByTestId("deleteButton"));
    expect(handleDeleteStep).toHaveBeenCalledTimes(1);
  });

  it("calls handleEditStep when edit button is clicked", () => {
    const handleEditStep = jest.fn();
    const { getByTestId } = render(
      <CustomStep step={mockStep} handleEditStep={handleEditStep} />
    );

    fireEvent.click(screen.getByTestId("modifButton"));
    expect(handleEditStep).toHaveBeenCalledTimes(1);
  });

  it("calls setNewStep when add button is clicked", () => {
    const setNewStep = jest.fn();
    const { getByText } = render(
      <CustomStep step={mockStep} setNewStep={setNewStep} />
    );

    fireEvent.click(screen.getByTestId("addButton"));
    expect(setNewStep).toHaveBeenCalledTimes(1);
  });
});
