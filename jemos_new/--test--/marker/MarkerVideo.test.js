import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MarkerVideo from "../../src/components/screens/marker/MarkerVideo";


describe("MarkerVideo", () => {
  const markerVideo = ["video1.mp3", "video2.mp3"];
  const marker = {
    video: ["video3.mp3", "video4.mp3"],
    videoName: ["Video 3", "Video 4"],
    mainResource: "video3.mp3",
  };
  const setMarkerVideo = jest.fn();
  const markerVideoName = ["Video 1", "Video 2"];
  const setMarkerVideoName = jest.fn();
  const mainResource = "video3.mp3";

  const renderMarkerVideo = () => {
    return render(
      <MarkerVideo
        markerVideo={markerVideo}
        marker={marker}
        setMarkerVideo={setMarkerVideo}
        markerVideoName={markerVideoName}
        setMarkerVideoName={setMarkerVideoName}
        mainResource={mainResource}
      />
    );
  };

  test("renders marker video correctly", () => {
    renderMarkerVideo();

    expect(screen.getByText("Video 1")).toBeInTheDocument();
    expect(screen.getByText("Video 2")).toBeInTheDocument();
  });

  test("calls setMarkerVideo and setMarkerVideoName on video delete", () => {
    jest.spyOn(console, "log");

    renderMarkerVideo();

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(console.log).toHaveBeenCalledWith(
      "jest: Fonction de suppression est appelée"
    );
  });
});
