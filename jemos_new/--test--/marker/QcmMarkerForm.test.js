import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QcmMarkerForm from "../../src/components/screens/marker/QcmMarkerForm";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("QcmMarkerForm", () => {
  const defaultProps = {
    question: "Initial Question",
    answersArray: ["Answer 1", "Answer 2"],
    correctAnswers: [0],
    successMessage: "Success",
    errorMessage: "Error",
    handleInputFocus: jest.fn(),
    handleInputBlur: jest.fn(),
    handleQuestionChange: jest.fn(),
    handleAnswerChange: jest.fn(),
    handleCorrectAnswerChange: jest.fn(),
    handleSuccessMessageChange: jest.fn(),
    handleErrorMessageChange: jest.fn(),
    handleAddAnswer: jest.fn(),
  };

  it("renders the question input correctly", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    expect(questionInput).toBeInTheDocument();
  });

  it("renders the answers inputs correctly", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const answerInputs = screen.getAllByDisplayValue(/Answer/);
    expect(answerInputs).toHaveLength(2);
  });

  it("renders the success and error message inputs correctly", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const successMessageInput = screen.getByDisplayValue("Success");
    const errorMessageInput = screen.getByDisplayValue("Error");
    expect(successMessageInput).toBeInTheDocument();
    expect(errorMessageInput).toBeInTheDocument();
  });

  it("calls handleQuestionChange on question input change", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    fireEvent.change(questionInput, { target: { value: "New Question" } });
    expect(defaultProps.handleQuestionChange).toHaveBeenCalled();
  });

  it("calls handleAnswerChange on answer input change", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const answerInput = screen.getAllByDisplayValue(/Answer/)[0];
    fireEvent.change(answerInput, { target: { value: "New Answer 1" } });
    expect(defaultProps.handleAnswerChange).toHaveBeenCalled();
  });

  it("calls handleCorrectAnswerChange on correct answer checkbox change", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const correctAnswerCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(correctAnswerCheckbox);
    expect(defaultProps.handleCorrectAnswerChange).toHaveBeenCalled();
  });

  it("calls handleSuccessMessageChange on success message input change", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const successMessageInput = screen.getByDisplayValue("Success");
    fireEvent.change(successMessageInput, { target: { value: "New Success" } });
    expect(defaultProps.handleSuccessMessageChange).toHaveBeenCalled();
  });

  it("calls handleErrorMessageChange on error message input change", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const errorMessageInput = screen.getByDisplayValue("Error");
    fireEvent.change(errorMessageInput, { target: { value: "New Error" } });
    expect(defaultProps.handleErrorMessageChange).toHaveBeenCalled();
  });

  it("calls handleAddAnswer on add answer button click", () => {
    render(<QcmMarkerForm {...defaultProps} />);
    const addButton = screen.getByText("addOption");
    fireEvent.click(addButton);
    expect(defaultProps.handleAddAnswer).toHaveBeenCalled();
  });

  it("does not render add answer button if answers array length is 13", () => {
    const propsWithMaxAnswers = {
      ...defaultProps,
      answersArray: new Array(13).fill("Answer"),
    };
    render(<QcmMarkerForm {...propsWithMaxAnswers} />);
    const addButton = screen.queryByText("addOption");
    expect(addButton).not.toBeInTheDocument();
  });
});
