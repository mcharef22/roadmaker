import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InformationMarkerForm from "../../src/components/screens/marker/InformationMarkerForm";

jest.mock("../../src/components/map/gpx/Resources", () => ({
  gpxStructure: {
    standardPoints: {
      Velo: ["point1", "point2"],
      Voiture: ["point3", "point4"],
      Rando: ["point5", "point6"],
    },
  },
}));

describe("InformationMarkerForm", () => {
  const mockMarker = {
    subType: "Touristic",
  };

  const mockProjectDatas = {
    projectType: "Velo",
  };

  const mockUpdateMarkerSubType = jest.fn();
  const mockSetEditedSubType = jest.fn();
  const mockUpdateCheckAudio = jest.fn();
  const mockHandleSubTypeChanged = jest.fn();
  const mockSetMarkerSubType = jest.fn();
  const mockSetMarkerTitle = jest.fn();
  const mockSetMarkerDescription = jest.fn();

  beforeEach(() => {
    render(
      <InformationMarkerForm
        marker={mockMarker}
        projectDatas={mockProjectDatas}
        setMarkerSubType={mockSetMarkerSubType}
        updateMarkerSubType={mockUpdateMarkerSubType}
        markerSubType=""
        setEditedSubType={mockSetEditedSubType}
        markerCheckAudio={false}
        updateCheckAudio={mockUpdateCheckAudio}
        handleSubTypeChanged={mockHandleSubTypeChanged}
        setMarkerTitle={mockSetMarkerTitle}
        setMarkerDescription={mockSetMarkerDescription}
      />
    );
  });

  test("form with default values", () => {
    const selectElement = screen.getByLabelText("type");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement.value).toBe("");

    const checkboxElement = screen.getByLabelText("Audio");
    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement.checked).toBe(false);
  });

  test("updateMarkerSubType and updateMarkerInfoType on select change", () => {
    jest.spyOn(console, "log");
    const selectElement = screen.getByLabelText("type");
    fireEvent.change(selectElement, { target: { value: "Voiture" } });

    expect(console.log).toHaveBeenCalledWith(
      "jest: Appeler la fonction handleSubTypeChanged"
    );
  });

  test("should call updateCheckAudio on checkbox click", () => {
    const checkboxElement = screen.getByLabelText("Audio");
    fireEvent.click(checkboxElement);

    expect(mockUpdateCheckAudio).toHaveBeenCalled();
  });
});
