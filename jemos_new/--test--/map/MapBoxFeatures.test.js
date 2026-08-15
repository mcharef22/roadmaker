import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MapBoxFeatures from "../../src/components/map/mapBox/mapBoxFeatures/MapBoxFeatures";
import i18n from "i18next";

const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

const commonProps = {
  handleCompile: jest.fn(),
  refreshMap: jest.fn(),
  sendDataToServ: jest.fn(),
  handleSendGpxToServ: jest.fn(),
  exportParcours: jest.fn(),
};

test("should call showNavigationPanel when 'Indications initiales' button is clicked", () => {
  const showNavigationPanelMock = jest.fn();

  const { getByText } = render(
    <MapBoxFeatures
      {...commonProps}
      showNavigationPanel={showNavigationPanelMock}
      showCustomNavigationPanel={jest.fn()}
    />
  );

  const initialIndicationsButton = getByText(i18n.t("initialDirections"));
  fireEvent.click(initialIndicationsButton);

  expect(showNavigationPanelMock).toHaveBeenCalledTimes(1);
});

test("should call showCustomNavigationPanel when 'Indications personnalisées' button is clicked", () => {
  const showCustomNavigationPanelMock = jest.fn();

  const { getByText } = render(
    <MapBoxFeatures
      {...commonProps}
      showNavigationPanel={jest.fn()}
      showCustomNavigationPanel={showCustomNavigationPanelMock}
    />
  );

  const customIndicationsButton = getByText(i18n.t("customDirections"));
  fireEvent.click(customIndicationsButton);

  expect(showCustomNavigationPanelMock).toHaveBeenCalledTimes(1);
});
