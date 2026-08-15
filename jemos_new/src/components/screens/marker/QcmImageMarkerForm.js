import React from "react";
import { useTranslation } from "react-i18next";
import StyledText from "../../util/StyledText";

const QcmImageMarkerForm = ({
  question,
  answersArray,
  answersTitleArray,
  correctAnswers,
  successMessage,
  errorMessage,
  handleInputFocus,
  handleInputBlur,
  handleQuestionChange,
  handleAnswerChange,
  handleQcmImageTitleChange,
  handleCorrectAnswerChange,
  handleSuccessMessageChange,
  handleErrorMessageChange,
  handleAddAnswer,
  index,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <label className="mt-4">{t("questionQuiz")} *</label>
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
            <input
              className="inputModifMarker"
              type="file"
              accept="image/*"
              onChange={(event) => handleAnswerChange(event, index)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            {answer && (
              <img
                alt="Image téléchargée"
                src={answer}
                className="imageMarker"
                style={{ marginTop: "10px", maxHeight: "200px" }}
              />
            )}

            <StyledText
              markerText={answersTitleArray[index]}
              setMarkerText={(event) => handleQcmImageTitleChange(event, index)}
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
          className="buttonModifMarker mt-2 w-100 p-2"
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

export default QcmImageMarkerForm;
