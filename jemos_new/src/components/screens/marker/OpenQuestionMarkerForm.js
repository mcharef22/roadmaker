import React from "react";
import { useTranslation } from "react-i18next";
import StyledText from "../../util/StyledText";

const OpenQuestionMarkerForm = ({
  question,
  answer,
  successMessage,
  errorMessage,
  handleQuestionChange,
  handleAnswerChange,
  handleSuccessMessageChange,
  handleErrorMessageChange,
  handleInputFocus,
  handleInputBlur,
  index,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <label className="mt-4">{t("questionQuiz")}</label>
      <StyledText
        markerText={question}
        setMarkerText={(value) => handleQuestionChange(value, index)}
        index={index}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <label className="mt-4">{t("quizAnswer")}</label>
      <StyledText
        markerText={answer}
        setMarkerText={(value) => handleAnswerChange(value, index)}
        index={index}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <label className="mt-4">{t("successMessageQuiz")}</label>
      <StyledText
        markerText={successMessage}
        setMarkerText={(value) => handleSuccessMessageChange(value, index)}
        index={index}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <label className="mt-4">{t("errorMessageQuiz")}</label>
      <StyledText
        markerText={errorMessage}
        setMarkerText={(value) => handleErrorMessageChange(value, index)}
        index={index}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </>
  );
};

export default OpenQuestionMarkerForm;
