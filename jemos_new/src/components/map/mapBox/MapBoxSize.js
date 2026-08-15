import React from "react";
import { useTranslation } from "react-i18next";

const MapBoxSize = ({ zoom, setMapDimensions }) => {
  const { t } = useTranslation();
  return (
    <div className="m-2 d-flex align-items-center">
      <label className="m-2">{t("mapSize")}</label>
      <input
        type="range"
        min="50" 
        max="96" 
        defaultValue={zoom}
        onChange={(e) =>
          setMapDimensions({
            height: e.target.value + "%", 
            width: e.target.value + "%",
          })
        }
        aria-label="input-size"
      />
    </div>
  );
};


export default MapBoxSize;
