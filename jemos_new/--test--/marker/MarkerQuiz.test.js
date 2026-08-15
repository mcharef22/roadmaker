import React from "react";
import MarkerQuiz from "../../src/components/screens/marker/MarkerQuiz";
import { render, screen } from "@testing-library/react";

jest.mock("../../src/components/map/gpx/Resources", () => ({}));
describe("MarkerQuiz", () => {
  const props = {
    marker: {},
    handleImageChange: jest.fn(),
    updateImageName: jest.fn(),
    markerImage: "",
    setMarkerImage: jest.fn(),
    markerImageName: "",
    setMarkerImageName: jest.fn(),
    showInputImage: false,
    setShowInputImage: jest.fn(),
    resourceArray: ["resource1", "resource2"], //on simule les ressources
    handleMainRessourceChange: jest.fn(),
    mainResource: "",
    setMainResource: jest.fn(),
  };

  test("displays the 'Ajouter une image' button when showInputImage is false", () => {
    render(<MarkerQuiz {...props} />);
    const addButton = screen.getByLabelText("btn-image");
    expect(addButton).toBeInTheDocument();
  });

  test("displays the input file when showInputImage is true", () => {
    props.showInputImage = true;
    render(<MarkerQuiz {...props} />);
    const inputFile = screen.getByLabelText("input-image");
    expect(inputFile).toBeInTheDocument();
  });

  test("displays the resource options in the select element", () => {
    render(<MarkerQuiz {...props} />);
    const selectElement = screen.getByLabelText("input-MainResource");
    expect(selectElement).toBeInTheDocument();
    //on check voir si les ressources sont bien la
    expect(selectElement).toHaveTextContent("resource1");
    expect(selectElement).toHaveTextContent("resource2");
  });
});
