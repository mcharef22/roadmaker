import React, { useState } from "react";
import { markerTypes } from "../../map/MapWithMarker";
import MarkerEditionForm from "./MarkerEditionForm";
import MarkerInfos from "./MarkerInfos";
import { useTranslation } from "react-i18next";
import "../../style/Mobile.css";

const MarkerScreen = (props) => {
  const {
    marker,
    markers,
    selectedMarkerId,
    handleMarkerDelete,
    projectDatas,
    setEditedSubType,
    setMarkers,
    handleInputFocus,
    handleInputBlur,
    userData,
    showRessourcePOI,
    showConfigPOI,
    showQuizPOI,
    handleRessourceClick,
    handleConfigClick,
    handleQuizClick,
  } = props;

  const [editing, setEditing] = useState(false);
  const { t } = useTranslation();

  return (
    <div>
      {marker.type === markerTypes.touristic && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className={`buttonsFeatures ${
              showRessourcePOI ? "selectedButton" : ""
            }`}
            onClick={handleRessourceClick}
          >
            {t("resources")}
          </button>
          <button
            className={`buttonsFeatures ${
              showConfigPOI ? "selectedButton" : ""
            }`}
            onClick={handleConfigClick}
          >
            {t("configurations")}
          </button>
          <button
            className={`buttonsFeatures ${showQuizPOI ? "selectedButton" : ""}`}
            onClick={handleQuizClick}
          >
            {t("quiz")}
          </button>
        </div>
      )}
      {!editing ? (
        <MarkerInfos
          marker={marker}
          setEditing={setEditing}
          projectDatas={projectDatas}
          showConfigPOI={showConfigPOI}
          showRessourcePOI={showRessourcePOI}
          showQuizPOI={showQuizPOI}
        />
      ) : (
        <MarkerEditionForm
          marker={marker}
          selectedMarkerId={selectedMarkerId}
          markers={markers}
          setEditing={setEditing}
          projectDatas={projectDatas}
          setEditedSubType={setEditedSubType}
          setMarkers={setMarkers}
          handleInputBlur={handleInputBlur}
          handleInputFocus={handleInputFocus}
          userData={userData}
          showConfigPOI={showConfigPOI}
          showRessourcePOI={showRessourcePOI}
          showQuizPOI={showQuizPOI}
        />
      )}
      {marker.type !== markerTypes.origin &&
        marker.type !== markerTypes.destination && (
          <button
            className="buttonDeleteAll"
            onClick={() => handleMarkerDelete(marker.id, marker._id)}
          >
            {t("delete")}
          </button>
        )}
    </div>
  );
};

export default MarkerScreen;
