import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizMarkerForm from "../../src/components/screens/marker/QuizMarkerForm";
import { DEFAULT_EMPTY_TEXT } from "../../src/components/map/gpx/Resources";
import { uploadFileToGithub } from "../../src/components/util/Util";

jest.mock("../../src/components/map/gpx/Resources", () => ({}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock("../../src/components/screens/marker/OpenQuestionMarkerForm", () =>
  jest.fn(() => <div>OpenQuestionMarkerForm</div>)
);
jest.mock("../../src/components/screens/marker/QcmMarkerForm", () =>
  jest.fn(() => <div>QcmMarkerForm</div>)
);
jest.mock("../../src/components/screens/marker/QcmImageMarkerForm", () =>
  jest.fn(() => <div>QcmImageMarkerForm</div>)
);
jest.mock("../../src/components/util/Util", () => ({
  uploadFileToGithub: jest.fn(),
}));
jest.mock("../../src/components/util/DialogBox", () => jest.fn());
jest.mock("../../src/components/util/LoadingBox", () => ({
  __esModule: true,
  default: jest.fn(),
  closeLoadingBox: jest.fn(),
}));

describe("QuizMarkerForm", () => {
  const defaultProps = {
    marker: { id: "testMarker" },
    markerOpenQuestion: [],
    setMarkerOpenQuestion: jest.fn(),
    markerQcmArray: [],
    setMarkerQcmArray: jest.fn(),
    markerQcmImageArray: [],
    setMarkerQcmImageArray: jest.fn(),
    handleInputFocus: jest.fn(),
    handleInputBlur: jest.fn(),
  };

  it("calls setMarkerOpenQuestion on adding an open question", () => {
    render(<QuizMarkerForm {...defaultProps} />);
    const button = screen.getByText("addQuestion");
    fireEvent.click(button);
    expect(defaultProps.setMarkerOpenQuestion).toHaveBeenCalled();
  });

  it("calls setMarkerQcmArray on adding a QCM question", () => {
    render(<QuizMarkerForm {...defaultProps} />);
    const button = screen.getByText("addQCM");
    fireEvent.click(button);
    expect(defaultProps.setMarkerQcmArray).toHaveBeenCalled();
  });

  it("calls setMarkerQcmImageArray on adding a QCM image question", () => {
    render(<QuizMarkerForm {...defaultProps} />);
    const button = screen.getByText("addQcmImage");
    fireEvent.click(button);
    expect(defaultProps.setMarkerQcmImageArray).toHaveBeenCalled();
  });
});
