import React from "react";
import { iconsPaths } from "./gpx/Resources";
import { useTranslation } from "react-i18next";

const InfoPointMenu = ({
  markerTypes,
  menuPosition,
  handleMenuItemClick,
  setShowInfoPointMenu,
  showInfoPointMenu,
  projectType,
}) => {
  const structureIconPath =
    iconsPaths.rootFolder + projectType + iconsPaths.PI_structure;
  const touristicIconPath =
    iconsPaths.rootFolder + projectType + iconsPaths.Touristic;
  const standardIconPath =
    iconsPaths.rootFolder + projectType + iconsPaths.PI_standard;

  const { t } = useTranslation();
  if (showInfoPointMenu)
    return (
      <div
        style={{
          position: "absolute",
          top: menuPosition.y + 100,
          left: menuPosition.x,
        }}
      >
        <button
          className="badge rounded-pill bg-danger col-2"
          onClick={() => setShowInfoPointMenu(false)}
        >
          <span>X</span>
        </button>
        <br />
        <button
          className="btn btn-success btn-sm col-12"
          onClick={() => {
            handleMenuItemClick(markerTypes.touristic);
            setShowInfoPointMenu(false);
          }}
        >
          <img style={{ width: "25px" }} src={touristicIconPath} />{" "}
          <span>{t("touristicPI")}</span>
        </button>
        <br />
        <button
          className="btn btn-info btn-sm col-12"
          onClick={() => {
            handleMenuItemClick(markerTypes.information);
            setShowInfoPointMenu(false);
          }}
        >
          <img style={{ width: "25px" }} src={standardIconPath} />
          <span>{t("standardPI")}</span>
        </button>
        <br />
        <button
          className="btn btn-success btn-sm col-12"
          onClick={() => {
            handleMenuItemClick(markerTypes.structure);
            setShowInfoPointMenu(false);
          }}
        >
          <img style={{ width: "25px" }} src={structureIconPath} />
          <span>{t("structurePI")}</span>
        </button>
      </div>
    );
};

export default InfoPointMenu;
