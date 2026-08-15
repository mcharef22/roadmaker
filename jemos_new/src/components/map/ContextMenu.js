import React from "react";
import { useTranslation } from "react-i18next";

const ContextMenu = ({
  menuVisible,
  markerTypes,
  originMarker,
  destinationMarker,
  menuPosition,
  handleMenuItemClick,
  handleClickOutsideMap,
  setCopiedCoordinates,
  setShowInfoPointMenu,
}) => {
  const { t } = useTranslation();
  if (menuVisible)
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
          onClick={() => handleClickOutsideMap}
        >
          <span>X</span>
        </button>
        <br />
        <button
          className="btn btn-success btn-sm col-12"
          onClick={() => handleMenuItemClick(markerTypes.origin)}
          disabled={Object.keys(originMarker).length === 0 ? false : true}
        >
          <span>🏁 {t("startRoute")}</span>
        </button>
        <br />
        <button
          className="btn btn-info btn-sm col-12"
          onClick={() => handleMenuItemClick(markerTypes.step)}
        >
          <span>📍{t("checkPoint")}</span>
        </button>
        <br />
        <button
          id="destination"
          className="btn btn-success btn-sm col-12"
          onClick={() => handleMenuItemClick(markerTypes.destination)}
          disabled={Object.keys(destinationMarker).length === 0 ? false : true}
        >
          <span>🏁 {t("endRoute")}</span>
        </button>
        <br />
        <button
          className="btn btn-info btn-sm col-12"
          onClick={() => setShowInfoPointMenu(true)}
        >
          <span>📍{t("interestPoint")}</span>
        </button>
        <br />
        <button
          className="btn btn-warning btn-sm col-12"
          onClick={() => {
            const coordinates = `${menuPosition.lat}, ${menuPosition.lng}`;
            navigator.clipboard
              .writeText(coordinates)
              .then(() => {
                setCopiedCoordinates(true);
                setTimeout(() => {
                  setCopiedCoordinates(false);
                }, 3000);
              })
              .catch((err) => {
                console.error("erreur: " + err);
              });
          }}
        >
          <span>{t("GPSCoord")}</span>
        </button>
      </div>
    );
};

export default ContextMenu;
