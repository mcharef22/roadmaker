import React from "react";
import { gpxStructure } from "../../map/gpx/Resources";
import {
  removeNumber,
  replaceKeywordRepas,
  replaceValueForDescription,
  replaceValueForTitle,
} from "../../util/Util";
import CheckBoxAudio from "./CheckBoxAudio";
import { useTranslation } from "react-i18next";

const InformationMarkerForm = ({
  marker,
  projectDatas,
  setMarkerTitle,
  markerSubType,
  setMarkerSubType,
  setEditedSubType,
  markerCheckAudio,
  updateCheckAudio,
  setMarkerDescription,
}) => {
  const { t } = useTranslation();
  const points =
    {
      Velo: gpxStructure.standardPoints.Velo,
      Voiture: gpxStructure.standardPoints.Voiture,
      Rando: gpxStructure.standardPoints.Rando,
    }[projectDatas.projectType] || gpxStructure.standardPoints.Voiture;

  /**
   * Permet de changer le type du marker
   * @param {string} value - valeur du type de point
   */
  const handleSubTypeChanged = (value) => {
    console.log("jest: Appeler la fonction handleSubTypeChanged");
    setMarkerSubType(value);
    setMarkerTitle(replaceValueForTitle(value));
    const subTypeValue = removeNumber(value);
    setMarkerDescription(replaceValueForDescription(subTypeValue));
    setEditedSubType(true);
  };
  return (
    <div className="m-1">
      <CheckBoxAudio
        markerCheckAudio={markerCheckAudio}
        updateCheckAudio={updateCheckAudio}
      />
      <label className="mt-4" htmlFor="markerType">
        {t("type")}
      </label>
      <br />
      <select
        id="markerType"
        className="selectMarker w-100 mt-1 "
        defaultValue={marker.subType ? marker.subType : markerSubType}
        onChange={(event) => {
          handleSubTypeChanged(event.target.value);
        }}
        aria-label="type"
      >
        <option value="">{t("selectType")}</option>
        {points.map((point, index) => (
          <option key={index} value={point}>
            {replaceKeywordRepas(point)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InformationMarkerForm;
