import React, { useEffect } from "react";
import TouristicMarker from "./TouristicMarker";
import { replaceKeywordRepas } from "../../util/Util";
import { markerTypes } from "../../map/MapWithMarker";
import { DISTANCE_TO_TRIGGER_AUDIO } from "../../map/gpx/Resources";
import { useTranslation } from "react-i18next";
const MarkerInfos = ({
  marker,
  setEditing,
  projectDatas,
  showRessourcePOI,
  showConfigPOI,
  showQuizPOI,
}) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-column justify-content-center mt-5">
      {marker.type !== markerTypes.step &&
        marker.type !== markerTypes.touristic && (
          <>
            <div className="d-flex ms-4 text-start">
              <h6 className="ms-4" data-testid="title">
                {t("title")} :{" "}
                <span dangerouslySetInnerHTML={{ __html: marker.title }} />
              </h6>
            </div>
            <div className=" descriptionText d-flex text-start ms-5  ">
              <h6 className="mt-1" data-testid="description">
                {t("description")} :{" "}
                <span
                  dangerouslySetInnerHTML={{ __html: marker.description }}
                />
              </h6>
            </div>
            {marker.type !== markerTypes.origin &&
              marker.type !== markerTypes.destination &&
              marker.type !== markerTypes.structure && (
                <div className="d-flex ms-4 mt-1 text-start">
                  <h6 className="ms-4">
                    Distance :{" "}
                    {marker.distanceToMarker
                      ? marker.distanceToMarker
                      : DISTANCE_TO_TRIGGER_AUDIO}
                  </h6>
                </div>
              )}

            {marker.type !== markerTypes.navigation &&
              marker.type !== "step" && (
                <div className="form-check form-switch d-flex justify-content-start align-items-center mt-1 ms-2 ">
                  <h6 className="form-check-label ">Audio</h6>
                  <input
                    disabled // On désactive le cochage dans sur cet écran
                    className="form-check-input ms-3 mb-2"
                    type="checkbox"
                    checked={marker.checkAudio}
                  />
                </div>
              )}
          </>
        )}

      {marker.type === markerTypes.touristic && (
        <TouristicMarker
          marker={marker}
          projectDatas={projectDatas}
          showRessourcePOI={showRessourcePOI}
          showConfigPOI={showConfigPOI}
          showQuizPOI={showQuizPOI}
        />
      )}
      {marker.subType && marker.type === markerTypes.information && (
        <div className="d-flex ms-4 mt-1 text-start">
          <h6 className="ms-4 text-start">
            {t("type")} : {replaceKeywordRepas(marker.subType)}
          </h6>
        </div>
      )}
      {marker.type !== markerTypes.step && (
        <div className="d-flex align-items-center justify-content-center">
          <button
            onClick={() => setEditing(true)}
            className="buttonModif mt-3 me-4 ms-2"
            aria-label="edit"
          >
            {t("edit")}
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkerInfos;
