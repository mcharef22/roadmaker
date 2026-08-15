import React from "react";
import parse from "html-react-parser";
import { translateManeuver } from "../mapBox/mapBoxFeatures/CompileProject";
import { indicationTypes } from "../gpx/Resources";

function CustomStep({
  step,
  displayCoordinates,
  handleDeleteStep,
  setNewStep,
  displayType,
  handleEditStep,
}) {
  return (
    <div className="d-flex" data-testid="showSteps">
      <div className="d-flex col-7">
        <a className="instructionsContainer col-12 mt-2">
          <>
            <span className="stepInstruction col-1">
              {step.stepNumber}. &nbsp;
              {parse(step.instructions)}
            </span>
            <br />
          </>
          {displayType && (
            <>
              <span className="badge text-bg-warning">
                {indicationTypes.includes(step.maneuver)
                  ? step.maneuver
                  : step.maneuver
                  ? translateManeuver(step.maneuver, step.instructions)
                  : ""}
              </span>
            </>
          )}
          {displayCoordinates && (
            <>
              {typeof step.start_location === "string" ? (
                <span className="badge text-bg-light">
                  {displayCoordinates ? "( " + step.start_location + " )" : ""}
                </span>
              ) : (
                <span className="badge text-bg-light">
                  {displayCoordinates
                    ? step.start_location.toString().substring(0, 8) +
                      "" +
                      step.start_location
                        .toString()
                        .substring(10, step.start_location.toString().length)
                    : ""}
                </span>
              )}
            </>
          )}
        </a>
      </div>
      <span className="distanceContainer d-flex m-1 ms-2 me-2 justify-content-between col-2">
        {step.distance.text}
      </span>
      <span className="actionsContainer">
        <a className="m-1" onClick={handleEditStep} data-testid="modifButton">
          <i className="bi bi-pencil-fill"></i>
        </a>
        <a
          className="m-1"
          onClick={handleDeleteStep}
          data-testid="deleteButton"
        >
          <i className="bi bi-x-lg"></i>
        </a>
        <a className="m-1" onClick={setNewStep} data-testid="addButton">
          <i className="bi bi-plus-lg"></i>
        </a>
      </span>
    </div>
  );
}

export default CustomStep;
