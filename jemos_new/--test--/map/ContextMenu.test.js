import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ContextMenu from "../../src/components/map/ContextMenu";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

describe("ContextMenu", () => {
  const handleClickOutsideMapMock = jest.fn();
  const handleMenuItemClickMock = jest.fn();
  const setCopiedCoordinatesMock = jest.fn();
  const setShowInfoPointMenuMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("call handleClickOutsideMap when X button is clicked", () => {
    jest.spyOn(console, "log");
    const { getByText } = render(
      <ContextMenu
        menuVisible={true}
        projectDatas={{}}
        markerTypes={{
          origin: "origin",
          destination: "destination",
          step: "step",
          navigation: "navigation",
          information: "information",
          touristic: "touristic",
          structure: "structure",
        }}
        originMarker={{}}
        destinationMarker={{}}
        menuPosition={{ x: 0, y: 0, lat: 0, lng: 0 }}
        handleMenuItemClick={handleMenuItemClickMock}
        handleClickOutsideMap={handleClickOutsideMapMock}
        setCopiedCoordinates={setCopiedCoordinatesMock}
        setShowInfoPointMenu={setShowInfoPointMenuMock}
      />
    );

    const xButton = screen.getByText("X");
    fireEvent.click(xButton);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: HandleClickOutsideMap est appelé"
      );
      console.log.mockRestore();
    });
  });

  test("call handleMenuItemClick with markerTypes.origin when 'Départ de l'itinéraire ici' button is clicked", () => {
    const markerTypes = {
      origin: "origin",
      destination: "destination",
      step: "step",
      navigation: "navigation",
      information: "information",
      touristic: "touristic",
      structure: "structure",
    };
    const { getByText } = render(
      <ContextMenu
        menuVisible={true}
        projectDatas={{}}
        markerTypes={markerTypes}
        originMarker={{}}
        destinationMarker={{}}
        menuPosition={{ x: 0, y: 0, lat: 0, lng: 0 }}
        handleMenuItemClick={handleMenuItemClickMock}
        handleClickOutsideMap={handleClickOutsideMapMock}
        setCopiedCoordinates={setCopiedCoordinatesMock}
        setShowInfoPointMenu={setShowInfoPointMenuMock}
      />
    );

    const originButton = screen.getByText("🏁 " + i18n.t("startRoute"));
    fireEvent.click(originButton);

    expect(handleMenuItemClickMock).toHaveBeenCalledWith(markerTypes.origin);
  });

  test("call handleMenuItemClick with markerTypes.step when 'Point de passage' button is clicked", () => {
    const markerTypes = {
      origin: "origin",
      destination: "destination",
      step: "step",
      navigation: "navigation",
      information: "information",
      touristic: "touristic",
      structure: "structure",
    };
    const { getByText } = render(
      <ContextMenu
        menuVisible={true}
        projectDatas={{}}
        markerTypes={markerTypes}
        originMarker={{}}
        destinationMarker={{}}
        menuPosition={{ x: 0, y: 0, lat: 0, lng: 0 }}
        handleMenuItemClick={handleMenuItemClickMock}
        handleClickOutsideMap={handleClickOutsideMapMock}
        setCopiedCoordinates={setCopiedCoordinatesMock}
        setShowInfoPointMenu={setShowInfoPointMenuMock}
      />
    );

    const stepButton = screen.getByText("📍" + i18n.t("checkPoint"));
    fireEvent.click(stepButton);

    expect(handleMenuItemClickMock).toHaveBeenCalledWith(markerTypes.step);
  });

  test("call handleMenuItemClick with markerTypes.destination when 'Arrivée de l'itinéraire' button is clicked", () => {
    const markerTypes = {
      origin: "origin",
      destination: "destination",
      step: "step",
      navigation: "navigation",
      information: "information",
      touristic: "touristic",
      structure: "structure",
    };

    const { getByText } = render(
      <ContextMenu
        menuVisible={true}
        projectDatas={{}}
        markerTypes={markerTypes}
        originMarker={{}}
        destinationMarker={{}}
        menuPosition={{ x: 0, y: 0, lat: 0, lng: 0 }}
        handleMenuItemClick={handleMenuItemClickMock}
        handleClickOutsideMap={handleClickOutsideMapMock}
        setCopiedCoordinates={setCopiedCoordinatesMock}
        setShowInfoPointMenu={setShowInfoPointMenuMock}
      />
    );

    const destinationButton = screen.getByText("🏁 " + i18n.t("endRoute"));
    fireEvent.click(destinationButton);

    expect(handleMenuItemClickMock).toHaveBeenCalledWith(
      markerTypes.destination
    );
  });

  test("call setShowInfoPointMenu when 'Point d'intérêt' button is clicked", () => {
    const markerTypes = {
      origin: "origin",
      destination: "destination",
      step: "step",
      navigation: "navigation",
      information: "information",
      touristic: "touristic",
      structure: "structure",
    };
    const { getByText } = render(
      <ContextMenu
        menuVisible={true}
        projectDatas={{}}
        markerTypes={markerTypes}
        originMarker={{}}
        destinationMarker={{}}
        menuPosition={{ x: 0, y: 0, lat: 0, lng: 0 }}
        handleMenuItemClick={handleMenuItemClickMock}
        handleClickOutsideMap={handleClickOutsideMapMock}
        setCopiedCoordinates={setCopiedCoordinatesMock}
        setShowInfoPointMenu={setShowInfoPointMenuMock}
      />
    );

    const infoPointButton = screen.getByText("📍" + i18n.t("interestPoint"));
    fireEvent.click(infoPointButton);

    expect(setShowInfoPointMenuMock).toHaveBeenCalledWith(true);
  });
});
