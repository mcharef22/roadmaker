import React from "react";
import { useTranslation } from "react-i18next";

const CheckBoxAudio = ({ markerCheckAudio, updateCheckAudio }) => {
  const { t } = useTranslation();
  return (
    <div className="form-check form-switch m-auto col-3 mt-4">
      <input
        className="form-check-input"
        type="checkbox"
        aria-label="Audio"
        checked={markerCheckAudio}
        onClick={updateCheckAudio}
      />
      <label className="form-check-label">{t("audio")}</label>
    </div>
  );
};
export default CheckBoxAudio;
