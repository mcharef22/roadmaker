import React from "react";
import { render, fireEvent } from "@testing-library/react";
import EditStepForm from "../../src/components/map/customNavigation/EditStepForm";
import i18n from "i18next";
const testLanguage = "fr";

// Mock de la fonction de traduction
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

jest.mock(
  "../../src/components/map/mapBox/mapBoxFeatures/CompileProject",
  () => ({
    translateManeuver: jest.fn(),
  })
);
jest.mock("../../src/components/map/gpx/Resources", () => ({
  indicationTypes: [
    "Gauche",
    "Droite",
    "Tout droit",
    "Retour",
    "Déviation à droite",
    "Déviation à gauche",
    "Continuer vers la droite",
    "Continuer vers la gauche",
    "Continuer tout droit",
    "1ère sortie",
    "2ème sortie",
    "3ème sortie",
    "4ème sortie",
    "5ème sortie",
    "Restez à droite",
    "Restez à gauche",
    "Légèrement à droite",
    "Légèrement à gauche",
    "Tourner carrément à droite",
    "Tourner carrément à gauche",
    "Audio",
  ],
}));

// Définition des valeurs par défaut pour les props
const defaultProps = {
  step: {
    stepNumber: 1,
    instructions: "test",
    distance: {
      text: "22 m",
      value: "22",
    },
    end_location: undefined,
    maneuver: "5ème sortie",
    start_location: "46.93646910716722, -0.8844199598932168",
    lat: "46.93646910716722, -0.8844199598932168",
    lng: "46.93646910716722, -0.8844199598932168",
  },
  divRef: null,
  newMessage: "",
  newStepType: "",
  checkAudio: true,
  setNewMessage: () => {},
  setNewStepType: () => {},
  newStepDistance: { value: "", text: "" },
  setNewStepCoordinates: () => {},
  indicationTypes: ["Type 1", "Type 2"],
  updateCheckAudio: () => {},
  handleEdit: () => {},
  StopEdit: () => {},
  updateStepDistance: () => {},
};

describe("EditStepForm", () => {
  const renderEditStepForm = (props) =>
    render(<EditStepForm {...defaultProps} {...props} />);

  it("renders correctly with default props", () => {
    const { getByText } = renderEditStepForm();

    expect(getByText(i18n.t("accept"))).toBeInTheDocument();
    expect(getByText(i18n.t("cancel"))).toBeInTheDocument();
  });

  it("calls handleEdit when the 'Valider' button is clicked", () => {
    const handleEdit = jest.fn();
    const { getByText } = renderEditStepForm({ handleEdit });

    fireEvent.click(getByText(i18n.t("accept")));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it("calls StopEdit when the 'Annuler' button is clicked", () => {
    const stopEdit = jest.fn();
    const { getByText } = renderEditStepForm({ stopEdit });

    fireEvent.click(getByText(i18n.t("cancel")));
    expect(stopEdit).toHaveBeenCalledTimes(1);
  });

  it("calls setNewMessage when the message input value changes", () => {
    const setNewMessage = jest.fn();
    const { getByTestId } = renderEditStepForm({ setNewMessage });

    fireEvent.change(getByTestId("instruction"), {
      target: { value: "Test" },
    });

    expect(setNewMessage).toHaveBeenCalledWith("Test");
  });

  it("calls setNewStepType when the type select value changes", () => {
    const setNewStepType = jest.fn();
    const { getByTestId } = renderEditStepForm({
      setNewStepType,
      newStepType: "DefaultType",
    });

    const selectType = getByTestId("select-type");
    fireEvent.change(selectType, { target: { value: "" } });

    expect(setNewStepType).toHaveBeenCalledWith("");
  });

  it("calls updateCheckAudio when the 'Audio' checkbox is clicked", () => {
    const updateCheckAudio = jest.fn();
    const { getByTestId } = renderEditStepForm({ updateCheckAudio });

    fireEvent.click(getByTestId("Audio"));

    expect(updateCheckAudio).toHaveBeenCalledTimes(1);
  });
});
