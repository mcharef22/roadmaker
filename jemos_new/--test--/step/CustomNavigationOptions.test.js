import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CustomNavigationOptions from "../../src/components/map/customNavigation/CustomNavigationOptions";
import i18n from "i18next";
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


// Fonction de simulation pour les fonctions de gestion d'état
const mockToggleType = jest.fn();
const mockToggleCoordinates = jest.fn();
const mockResetCustomIndications = jest.fn();
const mockSetFirstStep = jest.fn();

const defaultProps = {
  customIndicationsEdited: false,
  toggleType: mockToggleType,
  displayType: false,
  toggleCoordinates: mockToggleCoordinates,
  displayCoordinates: false,
  resetCustomIndications: mockResetCustomIndications,
  steps: [],
  setFirstStep: mockSetFirstStep,
};

describe("CustomNavigationOptions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(<CustomNavigationOptions {...defaultProps} />);

    expect(getByText(i18n.t("addStep"))).toBeInTheDocument();
    expect(getByText(i18n.t("showTypes"))).toBeInTheDocument();
    expect(getByText(i18n.t("showCoords"))).toBeInTheDocument();
  });

  it("calls toggleType when 'Afficher les types' button is clicked", () => {
    const { getByText } = render(<CustomNavigationOptions {...defaultProps} />);

    fireEvent.click(getByText(i18n.t("showTypes")));

    expect(mockToggleType).toHaveBeenCalledTimes(1);
  });

  it("calls toggleCoordinates when 'Afficher les coordonnées' button is clicked", () => {
    const { getByText } = render(<CustomNavigationOptions {...defaultProps} />);

    fireEvent.click(getByText(i18n.t("showCoords")));

    expect(mockToggleCoordinates).toHaveBeenCalledTimes(1);
  });

  it("calls resetCustomIndications when reset button is clicked", () => {
    const { getByText } = render(
      <CustomNavigationOptions
        {...defaultProps}
        customIndicationsEdited={true}
      />
    );

    fireEvent.click(getByText(i18n.t("resetIndications")));

    expect(mockResetCustomIndications).toHaveBeenCalledTimes(1);
  });

  it("calls setFirstStep when 'Ajouter une étape' button is clicked", () => {
    const { getByText } = render(
      <CustomNavigationOptions {...defaultProps} steps={[]} />
    );

    fireEvent.click(getByText(i18n.t("addStep")));

    expect(mockSetFirstStep).toHaveBeenCalledTimes(1);
  });
});
