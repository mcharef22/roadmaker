import React from "react";
import { render, screen } from "@testing-library/react";
import MarkerIcon from "../../src/components/screens/marker/MarkerIcon";

jest.mock("../../src/components/map/gpx/Resources", () => ({
  parcoursTypes: {
    car: "Voiture",
    cycle: "Velo",
    pedestrian: "Rando",
    fast_forward: "Retour_rapide",
  },
}));

jest.mock("../../src/components/screens/marker/cadre/cadreVoiture.png", () =>
  require("../__mocks__/fileMocks")
);
jest.mock("../../src/components/screens/marker/cadre/cadreVelo.png", () =>
  require("../__mocks__/fileMocks")
);
jest.mock("../../src/components/screens/marker/cadre/cadreVelo.png", () =>
  require("../__mocks__/fileMocks")
);
jest.mock("../../src/components/screens/marker/cadre/cadrePedestre.png", () =>
  require("../__mocks__/fileMocks")
);
jest.mock("../../src/components/screens/marker/cadre/cadreVeloAudio.png", () =>
  require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadrePedestreAudio.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreVoitureAudio.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreVoiturePartielPayant.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreAVoiturePatielPayant.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreAVeloPartielPayant.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreVeloPartielPayant.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock("../../src/components/screens/marker/cadre/cadrePayant.png", () =>
  require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreAudioPayant.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadreAPedestrePartielPayant.png",
  () => require("../__mocks__/fileMocks")
);
jest.mock(
  "../../src/components/screens/marker/cadre/cadrePedestrePartielPayant.png",
  () => require("../__mocks__/fileMocks")
);
describe("MarkerIcon", () => {
  test("renders MarkerIcon correctly", () => {
    const projectDatas = {
      projectType: "Voiture",
    };
    const markerAccesValue = "Gratuit";
    const markerCheckAudio = false;
    const markerIcon = null;
    const marker = {
      checkAcces: "Gratuit",
      checkAudio: false,
      iconImage: "image.png",
    };

    render(
      <MarkerIcon
        componentType="Information"
        projectDatas={projectDatas}
        markerAccesValue={markerAccesValue}
        markerCheckAudio={markerCheckAudio}
        markerIcon={markerIcon}
        marker={marker}
      />
    );

    const cadreVoitureImage = screen.getByAltText("Image de cadre");
    expect(cadreVoitureImage.src).toContain("file");
  });
});
