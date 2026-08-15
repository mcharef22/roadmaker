import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QcmImageMarkerForm from "../../src/components/screens/marker/QcmImageMarkerForm";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("QcmImageMarkerForm", () => {
  const defaultProps = {
    question: "Initial Question",
    answersArray: ["image1.png", "image2.png"],
    answersTitleArray: ["Title 1", "Title 2"],
    correctAnswers: [0],
    successMessage: "Success",
    errorMessage: "Error",
    handleInputFocus: jest.fn(),
    handleInputBlur: jest.fn(),
    handleQuestionChange: jest.fn(),
    handleAnswerChange: jest.fn(),
    handleQcmImageTitleChange: jest.fn(),
    handleCorrectAnswerChange: jest.fn(),
    handleSuccessMessageChange: jest.fn(),
    handleErrorMessageChange: jest.fn(),
    handleAddAnswer: jest.fn(),
  };

  it("renders the question input correctly", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    expect(questionInput).toBeInTheDocument();
  });

  it("renders the image titles correctly", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const answerTitleInputs = screen.getAllByDisplayValue(/Title/);
    expect(answerTitleInputs).toHaveLength(2);
  });

  it("renders the success and error message inputs correctly", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const successMessageInput = screen.getByDisplayValue("Success");
    const errorMessageInput = screen.getByDisplayValue("Error");
    expect(successMessageInput).toBeInTheDocument();
    expect(errorMessageInput).toBeInTheDocument();
  });

  it("calls handleQuestionChange on question input change", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const questionInput = screen.getByDisplayValue("Initial Question");
    fireEvent.change(questionInput, { target: { value: "New Question" } });
    expect(defaultProps.handleQuestionChange).toHaveBeenCalled();
  });

  it("calls handleQcmImageTitleChange on answer title input change", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const answerTitleInput = screen.getAllByDisplayValue("Title 1")[0];
    fireEvent.change(answerTitleInput, { target: { value: "New Title 1" } });
    expect(defaultProps.handleQcmImageTitleChange).toHaveBeenCalled();
  });

  it("calls handleCorrectAnswerChange on correct answer checkbox change", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const correctAnswerCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(correctAnswerCheckbox);
    expect(defaultProps.handleCorrectAnswerChange).toHaveBeenCalled();
  });

  it("calls handleSuccessMessageChange on success message input change", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const successMessageInput = screen.getByDisplayValue("Success");
    fireEvent.change(successMessageInput, { target: { value: "New Success" } });
    expect(defaultProps.handleSuccessMessageChange).toHaveBeenCalled();
  });

  it("calls handleErrorMessageChange on error message input change", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const errorMessageInput = screen.getByDisplayValue("Error");
    fireEvent.change(errorMessageInput, { target: { value: "New Error" } });
    expect(defaultProps.handleErrorMessageChange).toHaveBeenCalled();
  });

  it("calls handleAddAnswer on add answer button click", () => {
    render(<QcmImageMarkerForm {...defaultProps} />);
    const addButton = screen.getByText("addOption");
    fireEvent.click(addButton);
    expect(defaultProps.handleAddAnswer).toHaveBeenCalled();
  });

  it("does not render add answer button if answers array length is 13", () => {
    const propsWithMaxAnswers = {
      ...defaultProps,
      answersArray: new Array(13).fill("image.png"),
    };
    render(<QcmImageMarkerForm {...propsWithMaxAnswers} />);
    const addButton = screen.queryByText("addOption");
    expect(addButton).not.toBeInTheDocument();
  });
});
