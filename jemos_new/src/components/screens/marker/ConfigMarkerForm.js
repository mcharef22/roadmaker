import React from "react";
import { useTranslation } from "react-i18next";
import CheckBoxAudio from "./CheckBoxAudio";
import MarkerIcon from "./MarkerIcon";
import TriggerMarkerForm from "./TriggerMarkerForm";

const ConfigMarkerForm = ({
  marker,
  markerIcon,
  markerAccesValue,
  markerAudio,
  markerVideo,
  markerCheckAudio,
  projectDatas,
  setMarkerIcon,
  setMarkerAccesValue,
  updateCheckAudio,
  handleIconChange,
  iconNameWithoutBorder,
  updateIconNameWithoutBorder,
  triggerType,
  setTriggerType,
  triggerDistance,
  setTriggerDistance,
  showInputIcon,
  setShowInputIcon,
  markerDistance,
  updateMarkerDistance,
  handleInputFocus,
  handleInputBlur,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="divLabelInput">
        <label className="mt-4">{t("distance")}</label>
        <input
          className="inputModifMarker"
          type="text"
          value={markerDistance ? markerDistance : null}
          onChange={updateMarkerDistance}
          aria-label="input-distance"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      <CheckBoxAudio
        markerCheckAudio={markerCheckAudio}
        updateCheckAudio={updateCheckAudio}
      />
      <label className="mt-4">{t("icon")}</label>
      {markerIcon && (
        <>
          <MarkerIcon
            projectDatas={projectDatas}
            markerAudio={markerAudio}
            markerVideo={markerVideo}
            markerIcon={markerIcon}
            marker={marker}
            markerAccesValue={markerAccesValue}
            markerCheckAudio={markerCheckAudio}
            componentType="Formulaire"
            iconNameWithoutBorder={iconNameWithoutBorder}
          />
          <button
            type="button"
            className="buttonDeleteFile mt-3 me-2"
            onClick={(e) => { 
              updateIconNameWithoutBorder(e);
              setMarkerIcon("");
              
            }}
            aria-label="btn-supp"
          >
            <i className="bi bi-trash"></i>
          </button>
          <button
            type="button"
            className="buttonEditFile mt-3"
            onClick={() => setShowInputIcon(!showInputIcon)}
            aria-label="btn-modif"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <br />
        </>
      )}

      {showInputIcon && (
        <>
          <br />
          <input
            className="inputAddFile"
            type="file"
            accept=".jpg, .jpeg, .png"
            aria-label="input-icon"
            onChange={handleIconChange}
          />
        </>
      )}
      {!showInputIcon && !markerIcon && (
        <>
          <br />
          <button
            type="button"
            className="buttonModifMarker mt-1"
            onClick={() => setShowInputIcon(true)}
            aria-label="btn-icon"
          >
            {t("addTouristicIcon")}
          </button>
          <br />
        </>
      )}
      <div className="divLabelInput">
        <label className="form-check-label mt-4 mb-1">{t("access")}</label>
        <select
          className="selectMarker"
          value={markerAccesValue}
          onChange={(event) => setMarkerAccesValue(event.target.value)}
          aria-label="input-acces"
        >
          <option>{t("free")}</option>
          <option>{t("paid")}</option>
          <option>{t("partiallyPaid")}</option>
        </select>
      </div>

      <TriggerMarkerForm
        triggerType={triggerType}
        triggerDistance={triggerDistance}
        setTriggerType={setTriggerType}
        setTriggerDistance={setTriggerDistance}
      />
    </>
  );
};

export default ConfigMarkerForm;
