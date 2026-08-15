import React from "react";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { indicationTypes as defaultIndicationTypes } from "../gpx/Resources";

function AddStepForm({
  handleSubmit,
  handleCancel,
  setNewMessage,
  setNewStepDistance,
  setNewStepType,
  setNewStepCoordinates,
  indicationTypes = defaultIndicationTypes,
}) {
  const { t } = useTranslation();
  return (
    <form onSubmit={handleSubmit} className="formCustomDirections mt-2">
      <textarea
        className="inputCustomDirections"
        defaultValue=""
        onChange={(e) => setNewMessage(parse(e.target.value))}
        placeholder={t("addStep")}
        required={true}
      ></textarea>
      <input
        className="inputCustomDirections"
        placeholder="Distance"
        defaultValue=""
        onChange={(e) =>
          setNewStepDistance({
            value: e.target.value,
            text: e.target.value,
          })
        }
        required={true}
      />

      <select
        className="selectCustomDirections "
        onChange={(e) => setNewStepType(e.target.value)}
        data-testid="select-type"
      >
        <option value="">{t("chooseType")}</option>
        {indicationTypes.map((option, index) => (
          <option key={index} value={option}>
            {option === "Gauche" && t("left")}
            {option === "Droite" && t("right")}
            {option === "Tout droit" && t("ahead")}
            {option === "Retour" && t("return")}
            {option === "Déviation à droite" && t("deviationRight")}
            {option === "Déviation à gauche" && t("deviationLeft")}
            {option === "Continuer vers la droite" && t("continueRight")}
            {option === "Continuer vers la gauche" && t("continueLeft")}
            {option === "Continuer tout droit" && t("straightAhead")}
            {option === "1ère sortie" && t("1stExit")}
            {option === "2ème sortie" && t("2thExit")}
            {option === "3ème sortie" && t("3thExit")}
            {option === "4ème sortie" && t("4thExit")}
            {option === "5ème sortie" && t("5thExit")}
            {option === "Restez à droite" && t("stayRight")}
            {option === "Restez à gauche" && t("stayLeft")}
            {option === "Légèrement à droite" && t("slightlyRight")}
            {option === "Légèrement à gauche" && t("slightlyLeft")}
            {option === "Tourner carrément à droite" && t("sharplyRight")}
            {option === "Tourner carrément à gauche" && t("sharplyLeft")}
            {option === "Audio" && t("audio")}
          </option>
        ))}
      </select>
      <input
        className="inputCustomDirections"
        placeholder="lat,lng"
        defaultValue=""
        onChange={(e) => setNewStepCoordinates(e.target.value)}
        required={true}
      />
      <div className="d-flex justify-content-around m-2">
        <button className="validateCustomDirections p-2" type="submit">
          {t("accept")}
        </button>
        <button className="cancelCustomDirections p-2" onClick={handleCancel}>
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}

export default AddStepForm;
