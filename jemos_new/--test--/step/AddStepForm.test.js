import React from "react";
import { render, fireEvent } from "@testing-library/react";
import AddStepForm from "../../src/components/map/customNavigation/AddStepForm";
import i18n from "i18next";
const testLanguage = 'fr';

// Mock de la fonction de traduction
jest.mock('i18next', () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));


describe("AddStepForm", () => {
  const defaultProps = {
    handleSubmit: jest.fn(),
    handleCancel: jest.fn(),
    setNewMessage: jest.fn(),
    setNewStepDistance: jest.fn(),
    setNewStepType: jest.fn(),
    setNewStepCoordinates: jest.fn(),
    indicationTypes: [],
  };

  const renderAddStepForm = (props = {}) => {
    return render(<AddStepForm {...defaultProps} {...props} />);
  };

  it("renders correctly with default props", () => {
    const { getByPlaceholderText, getByText, getByTestId } =
      renderAddStepForm();

    expect(getByPlaceholderText(i18n.t("addStep"))).toBeInTheDocument();
    expect(getByPlaceholderText("Distance")).toBeInTheDocument();
    expect(getByTestId("select-type")).toBeInTheDocument();
    expect(getByPlaceholderText("lat,lng")).toBeInTheDocument();
    expect(getByText(i18n.t("accept"))).toBeInTheDocument();
    expect(getByText(i18n.t("cancel"))).toBeInTheDocument();
  });

  describe("calls handleSubmit when the form is submitted", () => {
    it("calls handleSubmit when the form is submitted", () => {
      const { getByText, getByPlaceholderText, getByTestId } =
        renderAddStepForm();

      fireEvent.change(getByPlaceholderText(i18n.t("addStep")), {
        target: { value: "Nouvelle étape" },
      });
      fireEvent.change(getByPlaceholderText("Distance"), {
        target: { value: "10" },
      });
      fireEvent.change(getByPlaceholderText("lat,lng"), {
        target: { value: "40.7128,-74.0060" },
      });

      fireEvent.change(getByTestId("select-type"), {
        target: { value: "Type 1" },
      });

      fireEvent.click(getByText(i18n.t("accept")));

      expect(defaultProps.handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("calls handleCancel when the 'Annuler' button is clicked", () => {
    const { getByText } = renderAddStepForm();

    fireEvent.click(getByText(i18n.t("cancel")));
    expect(defaultProps.handleCancel).toHaveBeenCalledTimes(1);
  });

  it("calls setNewMessage when the textarea value changes", () => {
    const { getByPlaceholderText } = renderAddStepForm();

    fireEvent.change(getByPlaceholderText(i18n.t("addStep")), {
      target: { value: "Test message" },
    });

    expect(defaultProps.setNewMessage).toHaveBeenCalledWith("Test message");
  });

  it("calls setNewStepDistance when the distance input value changes", () => {
    const { getByPlaceholderText } = renderAddStepForm();

    fireEvent.change(getByPlaceholderText("Distance"), {
      target: { value: "10" },
    });

    expect(defaultProps.setNewStepDistance).toHaveBeenCalledWith({
      value: "10",
      text: "10",
    });
  });

  it("calls setNewStepType when the type select value changes", () => {
    const { getByTestId } = renderAddStepForm({
      indicationTypes: ["Type 1", "Type 2"],
    });

    const selectType = getByTestId("select-type");
    fireEvent.change(selectType, { target: { value: "Type 2" } });

    expect(defaultProps.setNewStepType).toHaveBeenCalledWith("Type 2");
  });

  it("calls setNewStepCoordinates when the coordinates input value changes", () => {
    const { getByPlaceholderText } = renderAddStepForm();

    fireEvent.change(getByPlaceholderText("lat,lng"), {
      target: { value: "40.7128,-74.0060" },
    });

    expect(defaultProps.setNewStepCoordinates).toHaveBeenCalledWith(
      "40.7128,-74.0060"
    );
  });
});
