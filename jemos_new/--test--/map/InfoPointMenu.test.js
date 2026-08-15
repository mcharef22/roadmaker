import React from "react";
import { render, fireEvent } from "@testing-library/react";
import InfoPointMenu from "../../src/components/map/InfoPointMenu";
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock("../../src/components/map/gpx/Resources", () => ({
  iconsPaths: {
    rootFolder: "EML/",
    PI_structure: "/Structure.png",
    PI_touristic: "/contour.png",
    PI_standard: "/Info.png",
    Panorama: "/Panorama.png",
    Parking: "/Parking.png",
    Recharge: "/Recharge.png",
    Repas: "/Repas.png",
    Toilette: "/Toilette.png",
    Step: "/contour.png",
    Touristic: "/Touristic.png",
  },
}));

const markerTypesMock = {
  touristic: "touristic",
  information: "information",
  structure: "structure",
};

test("call handleMenuItemClick with markerTypes.touristic and setShowInfoPointMenu(false) when 'PI touristique' button is clicked", () => {
  const handleMenuItemClickMock = jest.fn();
  const setShowInfoPointMenuMock = jest.fn();

  const { getByText } = render(
    <InfoPointMenu
      markerTypes={markerTypesMock}
      menuPosition={{ x: 0, y: 0 }}
      handleMenuItemClick={handleMenuItemClickMock}
      setShowInfoPointMenu={setShowInfoPointMenuMock}
      showInfoPointMenu={true}
      projectType="example"
    />
  );

  const touristicButton = getByText(i18n.t("touristicPI"))
  fireEvent.click(touristicButton);

  expect(handleMenuItemClickMock).toHaveBeenCalledWith(
    markerTypesMock.touristic
  );
  expect(setShowInfoPointMenuMock).toHaveBeenCalledWith(false);
});

test("call handleMenuItemClick with markerTypes.information and setShowInfoPointMenu(false) when 'PI information' button is clicked", () => {
  const handleMenuItemClickMock = jest.fn();
  const setShowInfoPointMenuMock = jest.fn();

  const { getByText } = render(
    <InfoPointMenu
      markerTypes={markerTypesMock}
      menuPosition={{ x: 0, y: 0 }}
      handleMenuItemClick={handleMenuItemClickMock}
      setShowInfoPointMenu={setShowInfoPointMenuMock}
      showInfoPointMenu={true}
      projectType="example"
    />
  );

  const touristicButton = getByText(i18n.t("standardPI"));
  fireEvent.click(touristicButton);

  expect(handleMenuItemClickMock).toHaveBeenCalledWith(
    markerTypesMock.information
  );
  expect(setShowInfoPointMenuMock).toHaveBeenCalledWith(false);
});

test("call handleMenuItemClick with markerTypes.structure and setShowInfoPointMenu(false) when 'PI structure' button is clicked", () => {
  const handleMenuItemClickMock = jest.fn();
  const setShowInfoPointMenuMock = jest.fn();

  const { getByText } = render(
    <InfoPointMenu
      markerTypes={markerTypesMock}
      menuPosition={{ x: 0, y: 0 }}
      handleMenuItemClick={handleMenuItemClickMock}
      setShowInfoPointMenu={setShowInfoPointMenuMock}
      showInfoPointMenu={true}
      projectType="example"
    />
  );

  const touristicButton = getByText(i18n.t("structurePI"));
  fireEvent.click(touristicButton);

  expect(handleMenuItemClickMock).toHaveBeenCalledWith(
    markerTypesMock.structure
  );
  expect(setShowInfoPointMenuMock).toHaveBeenCalledWith(false);
});

test("should call setShowInfoPointMenu(false) when 'X' button is clicked", () => {
  const setShowInfoPointMenuMock = jest.fn();

  const { getByText } = render(
    <InfoPointMenu
      markerTypes={markerTypesMock}
      menuPosition={{ x: 0, y: 0 }}
      handleMenuItemClick={jest.fn()}
      setShowInfoPointMenu={setShowInfoPointMenuMock}
      showInfoPointMenu={true}
      projectType="example"
    />
  );

  const closeButton = getByText("X");
  fireEvent.click(closeButton);

  expect(setShowInfoPointMenuMock).toHaveBeenCalledWith(false);
});
