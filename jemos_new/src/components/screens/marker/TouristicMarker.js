import React from "react";
import RessourceTouristicMarker from "./RessourceTouristicMarker";
import "../../style/global.css";
import ConfigTouristicMarker from "./ConfigTouristicMarker";
import QuizTouristicMarker from "./QuizTouristicMarker";

const TouristicMarker = ({
  marker,
  projectDatas,
  showRessourcePOI,
  showConfigPOI,
  showQuizPOI,
}) => {
  return (
    <div>
      {showRessourcePOI && <RessourceTouristicMarker marker={marker} />}
      {showConfigPOI && (
        <ConfigTouristicMarker marker={marker} projectDatas={projectDatas} />
      )}
      {showQuizPOI && <QuizTouristicMarker marker={marker} />}
    </div>
  );
};

export default TouristicMarker;
