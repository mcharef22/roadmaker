import React from "react";
import { useTranslation } from "react-i18next";

const MapBoxOptions = ({
  distance,
  duration,
  showAllLabels,
  hideAllLabels,
  optimizeWaypoints,
  setOptimizeWaypoints,
  avoidHighways,
  setAvoidHighways,
  setPoilLabels,
}) => {
  const { t } = useTranslation();
  const handleLabelToggle = (checked) => {
    if (checked) {
      setPoilLabels(showAllLabels);
    } else {
      setPoilLabels(hideAllLabels);
    }
  };

  return (
    <div className="row m-2">
      <div className="mt-2">
        <h6 className="m-2">{distance}</h6>
        <h6 className="m-2">{duration}</h6>
      </div>
      <div className="form-check form-switch mt-2">
        <input
          className="switchRouteOption form-check-input"
          type="checkbox"
          defaultChecked
          onChange={() => {
            setOptimizeWaypoints(!optimizeWaypoints);
          }}
          aria-label="Optimisation d'itinéraire"
        />
        <label className="form-check-label">{t("routeOptimisation")}</label>
      </div>
      <div className="form-check form-switch mt-2">
        <input
          className="switchRouteOption form-check-input"
          type="checkbox"
          defaultChecked
          onChange={() => {
            setAvoidHighways(!avoidHighways);
          }}
          aria-label="Éviter les autoroutes"
        />
        <label className="form-check-label"> {t("avoidHighways")}</label>
      </div>
      <div className="form-check form-switch mt-2">
        <input
          className="switchRouteOption form-check-input"
          type="checkbox"
          onChange={(e) => {
            handleLabelToggle(e.target.checked);
          }}
          aria-label="Afficher les commerces et les stations"
        />
        <label className="form-check-label">{t("showShop&Stations")}</label>
      </div>
    </div>
  );
};

export default MapBoxOptions;
