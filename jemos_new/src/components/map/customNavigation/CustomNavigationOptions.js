import React from "react";
import { useTranslation } from "react-i18next";

function CustomNavigationOptions({
  customIndicationsEdited,
  toggleType,
  displayType,
  toggleCoordinates,
  displayCoordinates,
  resetCustomIndications,
  steps,
  setFirstStep,
}) {
  const { t } = useTranslation();
  return (
    <>
      {customIndicationsEdited && (
        <div className="d-flex justify-content-center mb-3">
          <button
            className="btnResetIndication"
            onClick={resetCustomIndications}
          >
            {t("resetIndications")}
          </button>
        </div>
      )}
      <div className="p-2 d-flex justify-content-around">
        {displayType ? (
          <button
            onClick={() => {
              toggleType(!displayType);
              console.log("jest: Masquer les types");
            }}
            className="btnCustomNavigationsHide"
          >
            {t("hideTypes")}
          </button>
        ) : (
          <button
            className="btnCustomNavigationsShow"
            onClick={() => {
              console.log("jest: Afficher les types");
              toggleType(!displayType);
            }}
          >
            {t("showTypes")}
          </button>
        )}
        {displayCoordinates ? (
          <button
            className="btnCustomNavigationsHide"
            onClick={() => {
              toggleCoordinates(!displayCoordinates);
              console.log("jest: Masquer les coordonnees");
            }}
          >
            {t("hideCoords")}
          </button>
        ) : (
          <button
            onClick={() => {
              toggleCoordinates(!displayCoordinates);
              console.log("jest: Afficher les coordonnees");
            }}
            className="btnCustomNavigationsShow"
          >
            {t("showCoords")}
          </button>
        )}
      </div>
      {steps.length === 0 && (
        <div className="d-flex justify-content-center mb-3">
          <button
            className="btn btn-success"
            onClick={() => setFirstStep(true)}
          >
            {t("addStep")}
          </button>
        </div>
      )}
    </>
  );
}

export default CustomNavigationOptions;
