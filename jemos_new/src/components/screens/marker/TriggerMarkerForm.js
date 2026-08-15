import React from "react";
import { useTranslation } from "react-i18next";

const TriggerMarkerForm = ({
  triggerDistance,
  triggerType,
  setTriggerType,
  setTriggerDistance,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="divLabelInput">
        <label className="form-check-label mt-4 mb-1">{t("triggerType")}</label>
        <select
          className="selectMarker"
          value={triggerType}
          onChange={(event) => setTriggerType(event.target.value)}
          aria-label="input-MainResource"
        >
          <option>{t("manual")}</option>
          <option>{t("qrCode")}</option>
          <option>{t("gps")}</option>
        </select>
      </div>
      {/* le select de distance ne s'affiche que si le type de declenchement est gps */}
      {triggerType === "GPS" && (
        <div className="divLabelInput">
          <label className="form-check-label mt-4 mb-1">
            {t("triggerDistance")}
          </label>
          <select
            className="selectMarker"
            value={triggerDistance}
            onChange={(event) => setTriggerDistance(event.target.value)}
            aria-label="input-MainResource"
          >
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
      )}
    </>
  );
};

export default TriggerMarkerForm;
