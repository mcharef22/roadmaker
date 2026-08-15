import React from "react";
import { useTranslation } from "react-i18next";
import "../../style/global.css";

const OpenQuestionTouristicMarker = ({ marker }) => {
  const { t } = useTranslation();
  return (
    <>
      {marker.openQuestionArray &&
        marker.openQuestionArray.map((item, index) => {
          if (item.question.trim() === "" || item.answer.trim() === "") {
            return null;
          }

          return (
            <div key={index}>
              <div className="cardOpenQuestion">
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
                    <h5>{t("quizAnswer")}:</h5>
                    <h6>
                      <span dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </h6>
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

export default OpenQuestionTouristicMarker;
