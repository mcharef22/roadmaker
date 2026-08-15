import React from "react";
import OpenQuestionTouristicMarker from "./OpenQuestionTouristicMarker";
import "../../style/global.css";
import QcmTouristicMarker from "./QcmTouristicMarker";
import QcmImageTouristicMarker from "./QcmImageTouristicMarker";

const QuizTouristicMarker = ({ marker }) => {
  return (
    <>
      <OpenQuestionTouristicMarker marker={marker} />
      <QcmTouristicMarker marker={marker} />
      <QcmImageTouristicMarker marker={marker} />
    </>
  );
};
export default QuizTouristicMarker;
