import React from "react";
import { useTranslation } from "react-i18next";
import "../../style/global.css";

const QcmTouristicMarker = ({ marker }) => {
  const { t } = useTranslation();

  return (
    <>
      {marker.qcmArray &&
        marker.qcmArray.map((item, index) => {
          if (item.question.trim() === "" || item.correctAnswers.length === 0) {
            return null;
          }

          return (
            <div key={index}>
              <div className="cardQcm">
                <div className="d-flex flex-column align-items-center m-4">
                  <div className="text-center">
                    <h5>{t("questionQuiz")}:</h5>
                    <h6>
                      <span
                        dangerouslySetInnerHTML={{ __html: item.question }}
                      />
                    </h6>
                  </div>

                  <div className="text-center">
                    <h5>{t("qcmAnswersChoices")}:</h5>
                    {item.answersArray.map((answer, answerIndex) => (
                      <h6 key={answerIndex}>
                        <span dangerouslySetInnerHTML={{ __html: answer }} />
                      </h6>
                    ))}
                  </div>

                  <div className="text-center">
                    <h5>{t("correctAnswers")}:</h5>
                    {item.correctAnswers.map((correctIndex) => (
                      <h6 key={correctIndex}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item.answersArray[correctIndex],
                          }}
                        />
                      </h6>
                    ))}
                  </div>

                  <div className="text-center">
                    <h5>{t("successMessageQuiz")}:</h5>
                    <span
                      dangerouslySetInnerHTML={{ __html: item.successMessage }}
                    />
                  </div>

                  <div className="text-center">
                    <h5>{t("errorMessageQuiz")}:</h5>
                    <span
                      dangerouslySetInnerHTML={{ __html: item.errorMessage }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default QcmTouristicMarker;
