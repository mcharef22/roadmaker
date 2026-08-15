import React from "react";
import { useTranslation } from "react-i18next";

const MarkerQuiz = ({
  showInputImage,
  handleImageChange,
  markerImage,
  setMarkerImage,
  markerImageName,
  setMarkerImageName,
  resourceArray,
  mainResource,
  setMainResource,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {!showInputImage && (
        <button aria-label="btn-image" type="button">
          {t("addPicture")}
        </button>
      )}
      {showInputImage && (
        <input
          aria-label="input-image"
          type="file"
          onChange={handleImageChange}
        />
      )}
      <select
        aria-label="input-MainResource"
        value={mainResource}
        onChange={(e) => setMainResource && setMainResource(e.target.value)}
      >
        {resourceArray &&
          resourceArray.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
      </select>
    </div>
  );
};

export default MarkerQuiz;
