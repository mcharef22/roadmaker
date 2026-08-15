import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MarkerImage from "../../src/components/screens/marker/MarkerImage";

describe("MarkerImage", () => {
  const markerImage = ["image1.mp3", "image2.mp3"];
  const marker = {
    image: ["image3.mp3", "image4.mp3"],
    imageName: ["Image 3", "Image 4"],
    mainResource: "image3.mp3",
  };
  const setMarkerImage = jest.fn();
  const markerImageName = ["Image 1", "Image 2"];
  const setMarkerImageName = jest.fn();
  const mainResource = "image3.mp3";

  const renderMarkerImage = () => {
    return render(
      <MarkerImage
        markerImage={markerImage}
        marker={marker}
        setMarkerImage={setMarkerImage}
        markerImageName={markerImageName}
        setMarkerImageName={setMarkerImageName}
        mainResource={mainResource}
      />
    );
  };

  test("renders marker image correctly", () => {
    renderMarkerImage();

    expect(screen.getByText("Image 1")).toBeInTheDocument();
    expect(screen.getByText("Image 2")).toBeInTheDocument();
  });

  test("calls setMarkerImage and setMarkerImageName on image delete", () => {
    jest.spyOn(console, "log");

    renderMarkerImage();

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(console.log).toHaveBeenCalledWith(
      "jest: Fonction de suppression est appelée"
    );
  });
});
