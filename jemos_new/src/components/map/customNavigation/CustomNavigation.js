import React from "react";
import parse from "html-react-parser";
import { useState, useRef, useEffect } from "react";
import { translateManeuver } from "../mapBox/mapBoxFeatures/CompileProject";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import AddStepForm from "./AddStepForm";
import CustomStep from "./CustomStep";
import EditStepForm from "./EditStepForm";
import CustomNavigationOptions from "./CustomNavigationOptions";
import { useTranslation } from "react-i18next";
import "../../style/DirectionsContainer.css";

export const CustomNavigation = ({
  directionsResponse,
  selectedRoute,
  customIndicationsEdited,
  setCustomIndicationsEdited,
  customNavigationPoints,
  setCustomNavigationPoints,
  setMapPosition,
  setInfoCustomNavig,
}) => {
  const [editStep, setEditStep] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [newStep, setNewStep] = useState(false);
  const [steps, setSteps] = useState([]);
  const [displayType, toggleType] = useState(true);
  const [displayCoordinates, toggleCoordinates] = useState(true);
  const [checkAudio, setCheckAudio] = useState(true);
  const [newStepDistance, setNewStepDistance] = useState({
    value: "",
    text: "",
  });
  const [previousDistance, setPreviousDistance] = useState("");
  const [newStepType, setNewStepType] = useState("");
  const [newStepCoordinates, setNewStepCoordinates] = useState("");
  const [options, setOptions] = useState([]);
  const [firstStep, setFirstStep] = useState(false);
  const divRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    /**
     * Initialisation des points de navigation
     */
    const initialNavigationPoints = [];
    let indications = [];
    if (customIndicationsEdited) {
      indications = customNavigationPoints;
    } else {
      if (directionsResponse && directionsResponse.routes) {
        directionsResponse.routes[selectedRoute].legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            indications.push(step);
          });
        });
    }
  }
    indications.map((step, j) => {
      let location;
      if (typeof step.start_location == "string")
        location = step.start_location;
      else {
        try {
          location = step.start_location.toUrlValue(6);
        } catch (error) {
          console.log("problème au niveau du : step.start_location.toUrlValue");
        }
      }
      try {
        initialNavigationPoints.push({
          stepNumber: j + 1,
          instructions: step.instructions,
          distance: step.distance,
          end_location: step.end_location,
          maneuver: step.maneuver,
          start_location: location,
          lat: step.start_location,
          lng: step.start_location,
        });
      } catch (error) {
        console.log("problème au niveau du step");
      }
    });

    /**
     * Initialisation des manœuvres, utilisation de la fonction translateManeuver
     */
    const maneuvers = initialNavigationPoints.map((step) =>
      translateManeuver(step.maneuver, step.instructions)
    );
    /**
     * Suppression des doublons dans le tableau maneuvers
     */
    const uniqueManeuvers = [...new Set(maneuvers)];
    setOptions(uniqueManeuvers);

    if (!steps.length) {
      setSteps(initialNavigationPoints);
    }
  }, [customNavigationPoints, directionsResponse]);
  

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setCheckAudio(true);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const handleEditStep = (step) => {
    setEditStep(step);
    setNewStepDistance({ value: step.distance.text, text: step.distance.text });
  };

  /**
   * Permet de modifier une étape
   */
  const handleEdit = () => {
    const newSteps = steps.map((step) => {
      if (step.stepNumber === editStep.stepNumber) {
        return {
          ...step,
          instructions: newMessage ? newMessage : step.instructions,
          distance: newStepDistance.text
            ? {
                text: /^(?=.*(?:m|M|km|KM|Km|kM|-1)).*$/.test(
                  newStepDistance.text
                )
                  ? newStepDistance.text
                  : newStepDistance.text + " m",
                value: /^(?=.*(?:m|M|km|KM|Km|kM|-1)).*$/.test(
                  newStepDistance.value
                )
                  ? newStepDistance.value
                  : newStepDistance.value + " m",
              }
            : { text: step.distance.text, value: step.distance.value },
          maneuver: newStepType ? newStepType : step.maneuver,
          start_location: newStepCoordinates
            ? newStepCoordinates
            : step.start_location,
        };
      }
      return step;
    });
    setCheckAudio(true);
    setNewStepDistance({ value: "", text: "" });
    setSteps(newSteps);
    setCustomNavigationPoints(newSteps);
    setEditStep(null);

    setNewStepType("");
    // voir si c'est utile ?
    setNewMessage("");
    setNewStepCoordinates();
    setCustomIndicationsEdited(true);
  };

  const stopEdit = () => {
    setCheckAudio(true);
    setEditStep(null);
    setNewMessage("");
    setNewStepDistance({ value: "", text: "" });
  };

  /**
   * Permet de supprimer une étape
   * @param {object} step - Étape concernée par la suppression
   */

  const handleDeleteStep = (step) => {
    const newSteps = steps.filter((s) => s.stepNumber !== step.stepNumber);
    let stepNumber = 1;
    const updatedStepsWithNumbers = newSteps.map((s) => {
      s.stepNumber = stepNumber;
      stepNumber++;
      return s;
    });
    setSteps(updatedStepsWithNumbers);
    setCustomNavigationPoints(updatedStepsWithNumbers);
    setCustomIndicationsEdited(true);
  };

  /**
   * Permet de réinitialiser les indications
   */
  const resetCustomIndications = async () => {
    console.log("jest: Fonction resetCustomIndications");
    const confirmReset = await DialogBoxWithConfirmation({
      title: t("confirmation"),
      text: t("resetIndications"),
      icon: "question",
      confirmButtonText: t("yes"),
      cancelButtonText: t("no"),
    });
    if (confirmReset) {
      let newSteps = [];
      directionsResponse &&
        directionsResponse.routes &&
        directionsResponse.routes[selectedRoute].legs.forEach((leg) => {
          leg.steps.forEach((step, i) => {
            const newStep = {
              ...step,
              stepNumber: i + 1,
            };
            newSteps.push(newStep);
          });
        });
      setSteps(newSteps);
      setCustomNavigationPoints(newSteps);
      setNewStep(false);
      setNewMessage("");
      setNewStepDistance({ value: "", text: "" });
      setNewStepType("");
      setNewStepCoordinates("");
      setCustomIndicationsEdited(false);
    }
  };

  /**
   *Permet de rajouter une étape dans la liste des étapes
   * @param {object} step - Étape concernée par l'ajout
   */
  const handleAddNewStep = (step) => {
    const newSteps = [...steps];
    const index = newStep.stepNumber;
    newSteps.splice(index, 0, {
      stepNumber: firstStep ? 1 : index + 1,
      instructions: newMessage,
      distance: {
        text: /^(?=.*(?:m|M|km|KM|Km|-1)).*$/.test(newStepDistance.text)
          ? newStepDistance.text
          : newStepDistance.text + " m",
        value: /^(?=.*(?:m|M|km|KM|Km|-1)).*$/.test(newStepDistance.value)
          ? newStepDistance.value
          : newStepDistance.value + " m",
      },
      maneuver: newStepType,
      start_location: newStepCoordinates,
    });
    // mise à jour des étapes
    const updatedSteps = newSteps.map((step, i) => {
      if (i > index) {
        console.log("stepNumber : " + step.stepNumber);
        return {
          ...step,
          stepNumber: i + 1,
        };
      }
      return step;
    });
    setSteps(updatedSteps);
    setCustomNavigationPoints(updatedSteps);
    setNewStep(false);
    setNewMessage("");
    setNewStepDistance({ value: "", text: "" });
    setNewStepType("");
    setNewStepCoordinates("");
    setCustomIndicationsEdited(true);
  };

  /**
   * Permet de faire le focus sur l'étape et d'afficher les infos
   * @param {object} step - Étape concernée par le clic
   */

  const handleStepClick = (step) => {
    const [lat, lng] = step.start_location.toString().split(",");
    setMapPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
    setInfoCustomNavig(parse(step.instructions));
    console.log(step);
  };

  /**
   * Met à jour la checkbox audio
   * @param {event} event - Événement lié à la checkbox
   */

  const updateCheckAudio = (event) => {
    setPreviousDistance(newStepDistance.text);
    const newCheckAudio = event.target.checked;
    setCheckAudio(newCheckAudio);
    if (!newCheckAudio) {
      setNewStepDistance({ value: "-1", text: "-1" });
    } else {
      setNewStepDistance({ value: previousDistance, text: previousDistance });
    }
  };

  /**
   * Permet de mettre à jour la distance
   * @param {event} event - Événement lié à la distance
   */

  const updateStepDistance = (event) => {
    const newDistance = event.target.value;
    setPreviousDistance(newDistance);
    setNewStepDistance({ value: newDistance, text: newDistance });
    if (newDistance > -1) {
      setCheckAudio(true);
    }
  };

  return (
    <>
      {directionsResponse &&
        directionsResponse.routes &&
        directionsResponse.routes[selectedRoute].warnings}
      {/*{directionsResponse.routes[0].legs.map((leg, i) => (*/}
      <div style={{ height: "500px " }}>
        <CustomNavigationOptions
          customIndicationsEdited={customIndicationsEdited}
          toggleType={toggleType}
          displayType={displayType}
          toggleCoordinates={toggleCoordinates}
          displayCoordinates={displayCoordinates}
          resetCustomIndications={resetCustomIndications}
          steps={steps}
          setFirstStep={setFirstStep}
        />
        {firstStep && (
          <AddStepForm
            handleSubmit={(e) => {
              e.preventDefault();
              handleAddNewStep();
              setFirstStep(false);
            }}
            handleCancel={() => setFirstStep(false)}
            setNewMessage={setNewMessage}
            setNewStepDistance={setNewStepDistance}
            setNewStepType={newStepType}
            setNewStepCoordinates={setNewStepCoordinates}
          />
        )}
        <ul
          style={{
            height: "500px",
            overflowY: "auto",
            listStyleType: "none",
          }}
        >
          {steps.map((step, j) => (
            <li
              key={j}
              onClick={() => handleStepClick(step)}
              data-testid="showSteps"
              className="stepContainer mb-2 "
            >
              {editStep && editStep.stepNumber === step.stepNumber ? (
                <EditStepForm
                  step={step}
                  divRef={divRef}
                  newMessage={newMessage}
                  newStepType={newStepType}
                  checkAudio={checkAudio}
                  setNewMessage={setNewMessage}
                  setNewStepType={setNewStepType}
                  newStepDistance={newStepDistance}
                  setNewStepCoordinates={setNewStepCoordinates}
                  updateCheckAudio={updateCheckAudio}
                  handleEdit={handleEdit}
                  stopEdit={stopEdit}
                  updateStepDistance={updateStepDistance}
                />
              ) : (
                <CustomStep
                  step={step}
                  displayCoordinates={displayCoordinates}
                  displayType={displayType}
                  handleDeleteStep={() => handleDeleteStep(step)}
                  setNewStep={() => setNewStep(step)}
                  handleEditStep={() => handleEditStep(step)}
                />
              )}

              <div>
                {newStep && newStep.stepNumber === step.stepNumber && (
                  <AddStepForm
                    handleSubmit={(e) => handleAddNewStep(e, step)}
                    handleCancel={() => setNewStep(false)}
                    setNewMessage={setNewMessage}
                    setNewStepDistance={setNewStepDistance}
                    setNewStepType={newStepType}
                    setNewStepCoordinates={setNewStepCoordinates}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default CustomNavigation;
