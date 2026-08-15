import React from "react";
import { useTranslation } from "react-i18next";
import "../../style/global.css";

const QcmImageTouristicMarker = ({ marker }) => {
  const { t } = useTranslation();

  return (
    <>
      {marker.qcmImageArray &&
        marker.qcmImageArray.map((item, index) => {
          if (item.question.trim() === "" || item.correctAnswers.length === 0) {
            return null;
          }

          return (
            <div key={index}>
              <div className="cardQcmImage">
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
                    {item.answersArray &&
                      item.answersArray.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className="d-flex align-items-center"
                          style={{
                            justifyContent: "center",
                            marginTop: "10px",
                          }}
                        >
                          {answer !== "" && (
                            <h6 style={{ marginRight: "10px" }}>
                              {answerIndex + 1}.{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: item.answersTitleArray[answerIndex],
                                }}
                              />
                            </h6>
                          )}
                          {answer && (
                            <img
                              src={answer}
                              className="imageMarker"
                              style={{
                                maxHeight: "200px",
                                marginRight: "10px",
                              }}
                            />
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="text-center">
                    <h5>{t("correctAnswers")}:</h5>
                    {item.correctAnswers.map((correctIndex) => (
                      <h6 key={correctIndex}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item.answersTitleArray[correctIndex],
                          }}
                        />
                      </h6>
                    ))}
                  </div>

                  <div className="text-center">
                    <h5>{t("successMessageQuiz")}:</h5>
                    <h6>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.successMessage,
                        }}
                      />
                    </h6>
                  </div>

                  <div className="text-center">
                    <h5>{t("errorMessageQuiz")}:</h5>
                    <h6>
                      <span
                        dangerouslySetInnerHTML={{ __html: item.errorMessage }}
                      />
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default QcmImageTouristicMarker;
