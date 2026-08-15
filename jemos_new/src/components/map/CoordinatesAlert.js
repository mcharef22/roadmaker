import React from "react";
import { useTranslation } from "react-i18next";

const CoordinatesAlert = ({ copiedCoordinates }) => {
  const { t } = useTranslation();
  if (copiedCoordinates)
    return <div className="alert alert-success m-1">{t("coordsPasted")}</div>;
};

export default CoordinatesAlert;
