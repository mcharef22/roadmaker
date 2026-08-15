import React from "react";
import { useTranslation } from "react-i18next";
import StyledText from "../../util/StyledText";

const QcmMarkerForm = ({
  question,
  answersArray,
  correctAnswers,
  successMessage,
  errorMessage,
  handleQuestionChange,
  handleAnswerChange,
  handleCorrectAnswerChange,
  handleSuccessMessageChange,
  handleErrorMessageChange,
  handleAddAnswer,
  index,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <label className="mt-4">{t("questionQuiz")} * </label>
      <StyledText
        markerText={question}
        setMarkerText={(value) => handleQuestionChange(value, index)}
        index={index}
      />

      {answersArray &&
        answersArray.length > 0 &&
        answersArray.map((answer, index) => (
          <div key={index}>
            <label className="mt-4">
              {t("qcmAnswersChoices")} {index + 1} *
            </label>
            <StyledText
              markerText={answer}
              setMarkerText={(value) => handleAnswerChange(value, index)}
              index={index}
            />
            <input
              type="checkbox"
              checked={correctAnswers.includes(index)}
              onChange={(event) => handleCorrectAnswerChange(event, index)}
            />
            <label>{t("correctAnswers")}</label>
          </div>
        ))}

      {answersArray.length < 13 && (
        <button
          className="buttonModifMarker mt-2 w-100 p-2 "
          onClick={handleAddAnswer}
        >
          {t("addOption")}
        </button>
      )}

      <label className="mt-4">{t("successMessageQuiz")}</label>
      <StyledText
        markerText={successMessage}
        setMarkerText={(value) => handleSuccessMessageChange(value, index)}
        index={index}
      />

      <label className="mt-4">{t("errorMessageQuiz")}</label>
      <StyledText
        markerText={errorMessage}
        setMarkerText={(value) => handleErrorMessageChange(value, index)}
        index={index}
      />
    </>
  );
};

export default QcmMarkerForm;
