import React, { useState, useContext } from "react";
import UserContext from "../../../src/UserContext";
import MarkerScreen from "./marker/MarkerScreen";
import QrCode from "../map/QrCode";
import "../style/global.css";
function Indice({
  projectDatas,
  setEditedSubType,
  setMarkers,
  showQrCode,
  handleInputFocus,
  handleInputBlur,
  userData,
}) {
  const { markers, selectedMarkerId, handleMarkerDelete } =
    useContext(UserContext);
  const [showRessourcePOI, setShowRessourcePOI] = useState(true);
  const [showConfigPOI, setShowConfigPOI] = useState(false);
  const [showQuizPOI, setShowQuizPOI] = useState(false);

  const handleRessourceClick = () => {
    setShowRessourcePOI(true);
    setShowConfigPOI(false);
    setShowQuizPOI(false);
  };

  const handleConfigClick = () => {
    setShowRessourcePOI(false);
    setShowConfigPOI(true);
    setShowQuizPOI(false);
  };

  const handleQuizClick = () => {
    setShowRessourcePOI(false);
    setShowConfigPOI(false);
    setShowQuizPOI(true);
  };

  return (
    <>
      
            <div className="mobileContainer overflow-hidden bg-white">
              <svg
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 25"
                width="200"
                height="40"
                fill="#62bad9"
              >
                <title>Cadre mobile-svg</title>

                <path
                  id="Layer"
                  fill-rule="evenodd"
                  className="s0"
                  d="m211 857c-338 0-675.5 0-1013 0q0-544 0-1088 874 0 1748 0 0 544 0 1088c-244.8 0-489.7 0-735 0zm-289-824.5q0 232.6 0 465.2c84.4 0 168 0 251.6 0 0-171.7 0-343 0-514.4-84 0-167.6 0-251.6 0 0 16.3 0 32.2 0 49.2z"
                />
                <path
                  id="Layer"
                  fill-rule="evenodd"
                  className="s1"
                  d="m-78 32c0-16.5 0-32.4 0-48.7 84 0 167.6 0 251.6 0 0 171.4 0 342.7 0 514.4-83.6 0-167.2 0-251.6 0 0-155.1 0-310.1 0-465.7zm12.8 27.5c0 130 0.2 260-0.3 389.9-0.1 21.5 14.6 32 31.5 31.8 55.8-0.7 111.7-0.2 167.5-0.2 17.3 0 28.5-11.1 28.5-28.2q0.1-212.5 0.1-424.9c0-16.2-11.5-27.6-27.8-27.8-9.5 0-19 0-28.5 0-9.6 0-12.8 3.2-12.8 12.8 0 8.4-2.5 10.9-11 10.9q-28.8 0-57.5 0c-11.3-0.1-13.3-2-13.5-13.4-0.1-7-3.2-10.3-10-10.3-13.3 0-26.6 0-40 0-12.4 0-26.5 10.9-26.2 25.9 0.2 10.8 0 21.7 0 33.5z"
                />
                <path
                  id="Layer"
                  className="s0"
                  d="m199.8 171c0-11.3 0.2-22.2 0-33-0.3-15 13.8-25.9 26.2-25.9 13.4 0 26.7 0 40 0 6.8 0 9.9 3.3 10 10.3 0.2 11.4 2.2 13.3 13.5 13.4q28.7 0 57.5 0c8.5 0 11-2.5 11-10.9 0-9.6 3.2-12.8 12.8-12.8 9.5 0 19 0 28.5 0 16.3 0.2 27.8 11.6 27.8 27.8q0 212.4-0.1 424.9c0 17.1-11.2 28.2-28.5 28.2-55.8 0-111.7-0.5-167.5 0.2-16.9 0.2-31.6-10.3-31.5-31.8 0.5-129.9 0.3-259.9 0.3-390.4z"
                />
              </svg>
              <div className="markerScreen">
                {markers.map((marker) => (
                  <div key={marker.id}>
                    {selectedMarkerId === marker.id && (
                      <MarkerScreen
                        marker={marker}
                        markers={markers}
                        selectedMarkerId={selectedMarkerId}
                        handleMarkerDelete={handleMarkerDelete}
                        projectDatas={projectDatas}
                        setEditedSubType={setEditedSubType}
                        setMarkers={setMarkers}
                        handleInputBlur={handleInputBlur}
                        handleInputFocus={handleInputFocus}
                        userData={userData}
                        showRessourcePOI={showRessourcePOI}
                        showConfigPOI={showConfigPOI}
                        showQuizPOI={showQuizPOI}
                        handleRessourceClick={handleRessourceClick}
                        handleConfigClick={handleConfigClick}
                        handleQuizClick={handleQuizClick}
                      />
                    )}
                  </div>
                ))}
                {showQrCode && <QrCode />}
              </div>
            </div>
         
    </>
  );
}

export default Indice;
