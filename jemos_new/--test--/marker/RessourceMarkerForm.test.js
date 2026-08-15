import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RessourceMarkerForm from "../../src/components/screens/marker/RessourceMarkerForm";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("../../src/components/screens/marker/MarkerImage", () => {
  return function MockMarkerImage(props) {
    return <div>Mock MarkerImage</div>;
  };
});

jest.mock("../../src/components/screens/marker/MarkerVideo", () => {
  return function MockMarkerVideo(props) {
    return <div>Mock MarkerVideo</div>;
  };
});

jest.mock("../../src/components/screens/marker/UrlMarkerForm", () => {
  return function MockMarkerIcon(props) {
    return <div>UrlMarkerForm</div>;
  };
});

jest.mock("../../src/components/screens/marker/MarkerAudio", () => {
  return function MockMarkerAudio(props) {
    return <div>Mock MarkerAudio</div>;
  };
});

describe("RessourceMarkerForm", () => {
  const defaultProps = {
    marker: {},
    showInputAudio: false,
    showInputImage: false,
    showInputVideo: false,
    setShowInputAudio: jest.fn(),
    setShowInputImage: jest.fn(),
    setShowInputVideo: jest.fn(),
    markerImage: null,
    markerVideo: null,
    markerAudio: null,
    markerImageName: "",
    markerVideoName: "",
    markerAudioName: "",
    setMarkerImage: jest.fn(),
    setMarkerVideo: jest.fn(),
    setMarkerAudio: jest.fn(),
    setMarkerImageName: jest.fn(),
    setMarkerVideoName: jest.fn(),
    setMarkerAudioName: jest.fn(),
    mainResource: "",
    setResourceArray: jest.fn(),
    resourceArray: [],
    setMainResource: jest.fn(),
    handleAudioChange: jest.fn(),
    handleVideoChange: jest.fn(),
    handleImageChange: jest.fn(),
    handleDeleteAllAudio: jest.fn(),
    handleDeleteAllImage: jest.fn(),
    handleDeleteAllVideo: jest.fn(),
    updateAudioName: jest.fn(),
    updateImageName: jest.fn(),
    updateVideoName: jest.fn(),
    handleInputFocus: jest.fn(),
    handleInputBlur: jest.fn(),
    markerTitle: "",
    setMarkerTitle: jest.fn(),
    markerDescription: "",
    setMarkerDescription: jest.fn(),
    url: "",
    setUrl: jest.fn(),
  };

  it("renders title input", () => {
    render(<RessourceMarkerForm {...defaultProps} />);
    const input = screen.getByLabelText("input-titre");
    expect(input).toBeInTheDocument();
  });

  it("calls setMarkerTitle on title input change", () => {
    render(<RessourceMarkerForm {...defaultProps} />);
    const input = screen.getByLabelText("input-titre");
    fireEvent.change(input, { target: { value: "New Title" } });
    expect(defaultProps.setMarkerTitle).toHaveBeenCalledWith("New Title");
  });

  it("renders description textarea", () => {
    render(<RessourceMarkerForm {...defaultProps} />);
    const textarea = screen.getByLabelText("input-description");
    expect(textarea).toBeInTheDocument();
  });

  it("calls setMarkerDescription on description textarea change", () => {
    render(<RessourceMarkerForm {...defaultProps} />);
    const textarea = screen.getByLabelText("input-description");
    fireEvent.change(textarea, { target: { value: "New Description" } });
    expect(defaultProps.setMarkerDescription).toHaveBeenCalledWith(
      "New Description"
    );
  });

  it("renders UrlMarkerForm", () => {
    render(<RessourceMarkerForm {...defaultProps} />);
    expect(screen.getByText("UrlMarkerForm")).toBeInTheDocument();
  });
});
