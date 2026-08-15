import React from "react";
import {render, fireEvent, waitFor, getByLabelText, getByTestId, screen} from "@testing-library/react";
import CalculateRouteButtons from "../../src/components/map/mapBox/CalculateRouteButtons"
import i18n from "i18next";

// Définir la langue à utiliser dans vos tests
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


describe("CalculateRouteButtons", () => {
  test("should call handleTravelMode and calculateRoute mode button is clicked", () => {
    const handleTravelModeMock = jest.fn();
    const calculateRoute = jest.fn();
    jest.spyOn(console, "log");
    const googleMapsMock = {
      TravelMode: {
        DRIVING: "DRIVING",
        TWO_WHEELER: "TWO_WHEELER",
        WALKING: "WALKING",
        BICYCLING: "BICYCLING",
      },
    };

    // Définir window.google avec l'option get
    Object.defineProperty(window, "google", {
      get: jest.fn(() => ({ maps: googleMapsMock })),
    });

    const { getByText } = render(
      <CalculateRouteButtons
        handleTravelMode={handleTravelModeMock}
        calculateRoute={calculateRoute}
      />
    );

    const submit = screen.getByText(i18n.t("calculerTrajet"));
    fireEvent.click(submit);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: Appeller la fonction calculateRoute"
      );
      console.log.mockRestore();
    });

    const drivingButton = screen.getByTestId("drivingButton")
    fireEvent.click(drivingButton);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "jest: Fonction de handleTravelmode est appelé"
      );
      console.log.mockRestore();
    });
  });
});
