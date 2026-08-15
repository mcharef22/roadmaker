import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ButtonsFeatures from "../../src/components/map/mapBox/mapBoxFeatures/ButtonsFeatures";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

describe("ButtonsFeatures", () => {
  const sendDataToServMock = jest.fn();
  const handleCompileMock = jest.fn();
  const handleExportMock = jest.fn();
  const showInputGPXKmlMock = jest.fn();
  const showInputGPXMock = jest.fn();
  const showInputKMLMock = jest.fn();
  const handleKmlUploadMock = jest.fn();
  const handleProjectUploadMock = jest.fn();
  const handleGpxUploadMock = jest.fn();
  const setShowInputKMLMock = jest.fn();
  const setShowInputGPXMock = jest.fn();
  const setShowInputGPXKmlMock = jest.fn();

  const renderButtonsFeatures = (props) => {
    return render(
      <ButtonsFeatures
        sendDataToServ={sendDataToServMock}
        handleCompile={handleCompileMock}
        handleExport={handleExportMock}
        showInputGPXKml={showInputGPXKmlMock}
        showInputGPX={showInputGPXMock}
        showInputKML={showInputKMLMock}
        handleKmlUpload={handleKmlUploadMock}
        handleProjectUpload={handleProjectUploadMock}
        handleGpxUpload={handleGpxUploadMock}
        setShowInputKML={setShowInputKMLMock}
        setShowInputGPX={setShowInputGPXMock}
        setShowInputGPXKml={setShowInputGPXKmlMock}
        {...props}
      />
    );
  };

  test("calls sendDataToServ when 'Sauvegarder' button is clicked", () => {
    const { getByText } = renderButtonsFeatures();
    const sauvegarderButton = getByText(i18n.t("save"));
    fireEvent.click(sauvegarderButton);
    expect(sendDataToServMock).toHaveBeenCalledTimes(1);
  });

  test("calls handleExport when 'Exporter' button is clicked", () => {
    const { getByText } = renderButtonsFeatures();
    const exporterButton = getByText(i18n.t("export"));
    fireEvent.click(exporterButton);
    expect(handleExportMock).toHaveBeenCalledTimes(1);
  });

  const buttonTestCases = [
    {
      buttonName: i18n.t("locally"),
      logMessage: "jest: Cliquer sur le boutton En local",
    },
    {
      buttonName: i18n.t("onRoadPlayer"),
      logMessage: "jest: Cliquer sur le boutton Sur RoadPlayer",
      premiumUser: true,
    },
    {
      buttonName: "kml",
      logMessage: "jest: Cliquer sur le boutton KML",
      premiumUser: true,
    },
    {
      buttonName: "gpx",
      logMessage: "jest: Cliquer sur le boutton GPX",
      premiumUser: true,
    },
    {
      buttonName: i18n.t("parcours"),
      logMessage: "jest: Cliquer sur le boutton Parcours",
      premiumUser: true,
    },
  ];

  buttonTestCases.forEach((testCase) => {
    test(`button '${testCase.buttonName}'`, () => {
      jest.spyOn(console, "log");
      const { getByText } = renderButtonsFeatures({
        premiumUser: testCase.premiumUser,
      });
      const button = getByText(testCase.buttonName);
      fireEvent.click(button);
      expect(console.log).toHaveBeenCalledWith(testCase.logMessage);
    });
  });
});
