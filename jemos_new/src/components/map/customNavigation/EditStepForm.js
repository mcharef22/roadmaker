import React from "react";
import { translateManeuver } from "../mapBox/mapBoxFeatures/CompileProject";
import { removeHtmlTags } from "../../util/Util";
import { useTranslation } from "react-i18next";
import { indicationTypes } from "../gpx/Resources";

function EditStepForm({
  step,
  divRef,
  newMessage,
  newStepType,
  checkAudio,
  setNewMessage,
  setNewStepType,
  newStepDistance,
  setNewStepCoordinates,
  updateCheckAudio,
  handleEdit,
  stopEdit,
  updateStepDistance,
}) {
  const { t } = useTranslation();
  return (
    <div ref={divRef} className="formCustomDirections">
      <input
        className="inputCustomDirections"
        defaultValue={
          newMessage ? newMessage : removeHtmlTags(step.instructions)
        }
        onChange={(e) => setNewMessage(e.target.value)}
        data-testid="instruction"
      ></input>
      <input
        className="inputCustomDirections"
        value={newStepDistance.text}
        onChange={updateStepDistance}
        data-testid="distance"
      ></input>
      <div className="form-group">
        <select
          className="selectCustomDirections"
          defaultValue={step.maneuver ? step.maneuver : newStepType}
          onChange={(e) => setNewStepType(e.target.value)}
          data-testid="select-type"
        >
          <option value="">
            {translateManeuver(step.maneuver, step.instructions)}
          </option>

          {indicationTypes.map((option, index) => (
            <option key={index} value={option}>
              {option === indicationTypes[0] && t("left")}
              {option === indicationTypes[1] && t("right")}
              {option === indicationTypes[2] && t("ahead")}
              {option === indicationTypes[3] && t("return")}
              {option === indicationTypes[4] && t("deviationRight")}
              {option === indicationTypes[5] && t("deviationLeft")}
              {option === indicationTypes[6] && t("continueRight")}
              {option === indicationTypes[7] && t("continueLeft")}
              {option === indicationTypes[8] && t("straightAhead")}
              {option === indicationTypes[9] && t("1stExit")}
              {option === indicationTypes[10] && t("2thExit")}
              {option === indicationTypes[11] && t("3thExit")}
              {option === indicationTypes[12] && t("4thExit")}
              {option === indicationTypes[13] && t("5thExit")}
              {option === indicationTypes[14] && t("stayRight")}
              {option === indicationTypes[15] && t("stayLeft")}
              {option === indicationTypes[16] && t("slightlyRight")}
              {option === indicationTypes[17] && t("slightlyLeft")}
              {option === indicationTypes[18] && t("sharplyRight")}
              {option === indicationTypes[19] && t("sharplyLeft")}
              {option === indicationTypes[20] && t("audio")}
            </option>
          ))}
        </select>
      </div>
      <input
        className="inputCustomDirections"
        defaultValue={step.start_location}
        onChange={(e) => setNewStepCoordinates(e.target.value)}
      />
      <div className="d-flex justify-content-around m-2">
        <div className="form-check form-switch m-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={newStepDistance.text === "-1" ? false : checkAudio}
            onClick={updateCheckAudio}
            data-testid="Audio"
          />
          <label className="form-check-label text-white">Audio</label>
        </div>
        <button
          className="validateCustomDirections"
          onClick={() => {
            handleEdit();
          }}
        >
          {t("accept")}
        </button>
        <button
          className="cancelCustomDirections"
          onClick={() => {
            stopEdit();
          }}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default EditStepForm;
