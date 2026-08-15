import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OpenQuestionMarkerForm from "../../src/components/screens/marker/OpenQuestionMarkerForm";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("OpenQuestionMarkerForm", () => {
  const defaultProps = {
    question: "Initial Question",
    answer: "Initial Answer",
    successMessage: "Success",
    errorMessage: "Error",
    handleInputFocus: jest.fn(),
    handleInputBlur: jest.fn(),
    handleQuestionChange: jest.fn(),
    handleAnswerChange: jest.fn(),
    handleSuccessMessageChange: jest.fn(),
    handleErrorMessageChange: jest.fn(),
  };

  it("renders the question input correctly", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    expect(questionInput).toBeInTheDocument();
  });

  it("renders the answer input correctly", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const answerInput = screen.getByDisplayValue("Initial Answer");
    expect(answerInput).toBeInTheDocument();
  });

  it("renders the success and error message inputs correctly", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const successMessageInput = screen.getByDisplayValue("Success");
    const errorMessageInput = screen.getByDisplayValue("Error");
    expect(successMessageInput).toBeInTheDocument();
    expect(errorMessageInput).toBeInTheDocument();
  });

  it("calls handleQuestionChange on question input change", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    fireEvent.change(questionInput, { target: { value: "New Question" } });
    expect(defaultProps.handleQuestionChange).toHaveBeenCalled();
  });

  it("calls handleAnswerChange on answer input change", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const answerInput = screen.getByDisplayValue("Initial Answer");
    fireEvent.change(answerInput, { target: { value: "New Answer" } });
    expect(defaultProps.handleAnswerChange).toHaveBeenCalled();
  });

  it("calls handleSuccessMessageChange on success message input change", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const successMessageInput = screen.getByDisplayValue("Success");
    fireEvent.change(successMessageInput, { target: { value: "New Success" } });
    expect(defaultProps.handleSuccessMessageChange).toHaveBeenCalled();
  });

  it("calls handleErrorMessageChange on error message input change", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const errorMessageInput = screen.getByDisplayValue("Error");
    fireEvent.change(errorMessageInput, { target: { value: "New Error" } });
    expect(defaultProps.handleErrorMessageChange).toHaveBeenCalled();
  });

  it("calls handleInputFocus and handleInputBlur on focus and blur events", () => {
    render(<OpenQuestionMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    fireEvent.focus(questionInput);
    fireEvent.blur(questionInput);
    expect(defaultProps.handleInputFocus).toHaveBeenCalled();
    expect(defaultProps.handleInputBlur).toHaveBeenCalled();
  });
});
