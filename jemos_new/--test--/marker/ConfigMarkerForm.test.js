import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfigMarkerForm from "../../src/components/screens/marker/ConfigMarkerForm";
import { useTranslation } from "react-i18next";

jest.mock("../../src/components/map/gpx/Resources", () => ({}));

jest.mock("../../src/components/screens/marker/MarkerIcon", () => {
  return function MockMarkerIcon(props) {
    return <div>Mock MarkerIcon</div>;
  };
});

jest.mock("../../src/components/screens/marker/CheckBoxAudio", () => {
  return function MockCheckBoxAudio(props) {
    return <div>Mock CheckBoxAudio</div>;
  };
});

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe("ConfigMarkerForm", () => {
  const defaultProps = {
    marker: {},
    markerIcon: "",
    markerAccesValue: "",
    markerAudio: null,
    markerVideo: null,
    markerCheckAudio: false,
    projectDatas: [],
    setMarkerIcon: jest.fn(),
    setMarkerAccesValue: jest.fn(),
    updateCheckAudio: jest.fn(),
    handleIconChange: jest.fn(),
    iconNameWithoutBorder: "",
    updateIconNameWithoutBorder: jest.fn(),
    triggerType: "",
    setTriggerType: jest.fn(),
    triggerDistance: 0,
    setTriggerDistance: jest.fn(),
    showInputIcon: false,
    setShowInputIcon: jest.fn(),
    markerDistance: "",
    updateMarkerDistance: jest.fn(),
    handleInputFocus: jest.fn(),
    handleInputBlur: jest.fn(),
  };

  it("renders input for distance", () => {
    render(<ConfigMarkerForm {...defaultProps} />);
    const input = screen.getByLabelText("input-distance");
    expect(input).toBeInTheDocument();
  });

  it("calls updateMarkerDistance on distance input change", () => {
    render(<ConfigMarkerForm {...defaultProps} />);
    const input = screen.getByLabelText("input-distance");
    fireEvent.change(input, { target: { value: "10" } });
    expect(defaultProps.updateMarkerDistance).toHaveBeenCalled();
  });

  it("renders icon input when showInputIcon is true", () => {
    render(<ConfigMarkerForm {...defaultProps} showInputIcon={true} />);
    const input = screen.getByLabelText("input-icon");
    expect(input).toBeInTheDocument();
  });

  it("calls setShowInputIcon on add icon button click", () => {
    render(<ConfigMarkerForm {...defaultProps} />);
    const button = screen.getByLabelText("btn-icon");
    fireEvent.click(button);
    expect(defaultProps.setShowInputIcon).toHaveBeenCalledWith(true);
  });

  it("renders access select input", () => {
    render(<ConfigMarkerForm {...defaultProps} />);
    const select = screen.getByLabelText("input-acces");
    expect(select).toBeInTheDocument();
  });

  it("calls setMarkerAccesValue on access select change", () => {
    render(<ConfigMarkerForm {...defaultProps} />);
    const select = screen.getByLabelText("input-acces");
    fireEvent.change(select, { target: { value: "free" } });
    expect(defaultProps.setMarkerAccesValue).toHaveBeenCalled();
  });
});
