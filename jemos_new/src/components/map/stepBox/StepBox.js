import React, { useEffect, useState } from "react";
import StepBoxMarker from "./StepBoxMarker";
import StepBoxTouristicMarker from "./StepBoxTouristicMarker";
import { useTranslation } from "react-i18next";
import "../../style/StepBox.css";

const StepBox = ({
  markers,
  handleMarkerClick,
  titleOfProject,
  selectedMarkerId,
  stepMarkers,
  originMarker,
  destinationMarker,
}) => {
  const { t } = useTranslation();
  const [showMarkers, setShowMarkers] = useState(true);
  const [showResources, setShowResources] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  useEffect(() => {
    setSelectedMarker(selectedMarkerId);
  }, [selectedMarkerId]);

  /**
   * Permet de gérer l'affichage des ressources d'un PI
   * @param {integer} markerId - Id du PI
   */

  const handleIconPIClick = (markerId) => {
    console.log("jest: Appeler la fonction handleIconPIClick");
    setShowResources((prevState) => {
      const updatedState = [...prevState];
      const index = updatedState.indexOf(markerId);

      if (index === -1) {
        updatedState.push(markerId);
      } else {
        updatedState.splice(index, 1);
      }

      return updatedState;
    });
  };

  const origin = markers.find((marker) => marker.type === "origin");
  const destination = markers.find((marker) => marker.type === "destination");
  const wayPoints = markers.filter((marker) => marker.type === "step");

  const { otherMarkers } = markers.reduce(
    (acc, marker) => {
      if (
        marker.type !== "origin" &&
        marker.type !== "destination" &&
        marker.type !== "step"
      ) {
        acc.otherMarkers.push(marker);
      }
      return acc;
    },
    {
      otherMarkers: [],
    },
  );

  return (
    <div className="step-box">
      <div className="headerStepBox">
        <img
          src="/rm_imgs/logo_connexion.png"
          alt="logo"
          className="logoStepBox"
        />
        <div className="detailsStepBox d-flex align-items-center">
          <details
            onClick={() => {
              setShowMarkers(!showMarkers);
              console.log("jest: Afficher la liste des markers");
            }}
            aria-label="input-showMarkers"
            className="triangleStepBox"
          >
            <summary className="triangleStepBox marker-title"></summary>
          </details>
          <h2 className="titleProject">{titleOfProject}</h2>
        </div>
      </div>

      {showMarkers && (
        <div className="marker-list text-start">
          {markers.length === 0 ? (
            <h4>{t("noStep")}</h4>
          ) : (
            <>
              <StepBoxMarker
                key={originMarker.id}
                selectedMarker={selectedMarker}
                marker={origin}
                handleMarkerClick={handleMarkerClick}
                setSelectedMarker={setSelectedMarker}
              />

              {stepMarkers.length > 0 && (
                <>
                  <details open className="details-open">
                    <summary className="triangleWayPoints marker-title ">
                      <label className="text-dark fs-5 fw-bold mt-1 ms-1 ">
                        {t("stepPoints")} ({stepMarkers.length + ` points`})
                      </label>
                    </summary>
                    {wayPoints.map((marker) => (
                      <div className="ms-5">
                        <StepBoxMarker
                          key={marker.id}
                          selectedMarker={selectedMarker}
                          marker={marker}
                          handleMarkerClick={handleMarkerClick}
                          setSelectedMarker={setSelectedMarker}
                        />
                      </div>
                    ))}
                  </details>
                </>
              )}
              {otherMarkers.length > 0 && (
                <>
                  {otherMarkers.map((marker) => (
                    <StepBoxTouristicMarker
                      key={marker.id}
                      selectedMarker={selectedMarker}
                      marker={marker}
                      handleMarkerClick={handleMarkerClick}
                      setSelectedMarker={setSelectedMarker}
                      handleIconPIClick={handleIconPIClick}
                      showResources={showResources}
                    />
                  ))}
                </>
              )}
              <StepBoxMarker
                key={destinationMarker.id}
                selectedMarker={selectedMarker}
                marker={destination}
                handleMarkerClick={handleMarkerClick}
                setSelectedMarker={setSelectedMarker}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StepBox;
