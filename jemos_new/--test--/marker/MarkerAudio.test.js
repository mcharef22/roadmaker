import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MarkerAudio from "../../src/components/screens/marker/MarkerAudio";

describe("MarkerAudio", () => {
  jest.mock("../../src/components/map/gpx/Resources", () => ({}));
  const markerAudio = ["audio1.mp3", "audio2.mp3"];
  const marker = {
    audio: ["audio3.mp3", "audio4.mp3"],
    audioName: ["Audio 3", "Audio 4"],
    mainResource: "audio3.mp3",
  };
  const setMarkerAudio = jest.fn();
  const markerAudioName = ["Audio 1", "Audio 2", "audio3.mp3"];
  const setMarkerAudioName = jest.fn();
  const mainResource = "audio3.mp3";

  const renderMarkerAudio = () => {
    return render(
      <MarkerAudio
        markerAudio={markerAudio}
        marker={marker}
        setMarkerAudio={setMarkerAudio}
        markerAudioName={markerAudioName}
        setMarkerAudioName={setMarkerAudioName}
        mainResource={mainResource}
      />
    );
  };

  test("renders marker audio correctly", () => {
    renderMarkerAudio();

    expect(screen.getByText("Audio 1")).toBeInTheDocument();
    expect(screen.getByText("Audio 2")).toBeInTheDocument();
  });

  test("calls setMarkerAudio and setMarkerAudioName on audio delete", () => {
    jest.spyOn(console, "log");

    renderMarkerAudio();

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(console.log).toHaveBeenCalledWith(
      "jest: Fonction de suppression est appelée"
    );
  });
});
