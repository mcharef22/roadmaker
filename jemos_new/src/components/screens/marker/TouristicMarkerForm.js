import React, { useEffect } from "react";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import { useTranslation } from "react-i18next";
import ConfigMarkerForm from "./ConfigMarkerForm";
import RessourceMarkerForm from "./RessourceMarkerForm";
import QuizMarkerForm from "./QuizMarkerForm";
const TouristicMarkerForm = (props) => {
  const { t } = useTranslation();
  const {
    marker,
    handleImageChange,
    handleVideoChange,
    handleAudioChange,
    handleIconChange,
    updateImageName,
    updateVideoName,
    updateAudioName,
    updateIconNameWithoutBorder,
    updateCheckAudio,
    markerImage,
    markerAudio,
    markerVideo,
    markerIcon,
    markerCheckAudio,
    projectDatas,
    setMarkerAudio,
    setMarkerImage,
    setMarkerVideo,
    setMarkerIcon,
    markerAccesValue,
    markerImageName,
    markerVideoName,
    markerAudioName,
    iconNameWithoutBorder,
    setMarkerImageName,
    setMarkerVideoName,
    setMarkerAudioName,
    showInputImage,
    setShowInputImage,
    showInputAudio,
    setShowInputAudio,
    showInputVideo,
    setShowInputVideo,
    showInputIcon,
    setShowInputIcon,
    resourceArray,
    mainResource,
    setResourceArray,
    setMarkerAccesValue,
    setMainResource,
    triggerType,
    setTriggerType,
    triggerDistance,
    setTriggerDistance,
    url,
    setUrl,
    showConfigPOI,
    showRessourcePOI,
    showQuizPOI,
    handleInputFocus,
    handleInputBlur,
    markerTitle,
    setMarkerTitle,
    markerDescription,
    setMarkerDescription,
    markerDistance,
    updateMarkerDistance,
    markerOpenQuestion,
    setMarkerOpenQuestion,
    markerQcmArray,
    setMarkerQcmArray,
    markerQcmImageArray,
    setMarkerQcmImageArray,
  } = props;
  useEffect(() => {
    const allMarkerNames = [];

    if (markerImageName) {
      allMarkerNames.push(...markerImageName);
    }

    if (markerVideoName) {
      allMarkerNames.push(...markerVideoName);
    }

    if (markerAudioName) {
      allMarkerNames.push(...markerAudioName);
    }

    const updatedResourceArray = resourceArray.filter((item) =>
      allMarkerNames.includes(item)
    );

    setResourceArray(updatedResourceArray);
  }, [markerImageName, markerVideoName, markerAudioName]);

  /**
   * Permet de supprimer toutes les images
   * @param {event} e - clic sur le bouton
   */
  const handleDeleteAllImage = async (e) => {
    e.stopPropagation();
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("deleteImages"),
      text: t("deleteImagesText"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });
    // Confirmer la suppression
    if (confirmDelete) {
      setMarkerImage("");
      setMarkerImageName("");
    }
  };

  /**
   * Permet de supprimer toutes les vidéos
   * @param {event} e
   */

  const handleDeleteAllVideo = async (e) => {
    e.stopPropagation();
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("deleteVideos"),
      text: t("deleteVideosText"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });
    // Confirmer la suppression
    if (confirmDelete) {
      setMarkerVideo("");
      setMarkerVideoName("");
    }
  };

  /**
   * Permet de supprimer toutes les audios
   * @param {event} e
   */
  const handleDeleteAllAudio = async (e) => {
    e.stopPropagation();
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("deleteAudios"),
      text: t("deleteAudiosText"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });
    // Confirmer la suppression
    if (confirmDelete) {
      setMarkerAudio("");
      setMarkerAudioName("");
    }
  };

  return (
    <>
      <div className="m-1">
        {showConfigPOI && (
          <ConfigMarkerForm
            marker={marker}
            markerIcon={markerIcon}
            markerAccesValue={markerAccesValue}
            markerAudio={markerAudio}
            markerVideo={markerVideo}
            markerCheckAudio={markerCheckAudio}
            projectDatas={projectDatas}
            setMarkerIcon={setMarkerIcon}
            setMarkerAccesValue={setMarkerAccesValue}
            updateCheckAudio={updateCheckAudio}
            handleIconChange={handleIconChange}
            iconNameWithoutBorder={iconNameWithoutBorder}
            updateIconNameWithoutBorder={updateIconNameWithoutBorder}
            triggerType={triggerType}
            setTriggerType={setTriggerType}
            triggerDistance={triggerDistance}
            setTriggerDistance={setTriggerDistance}
            showInputIcon={showInputIcon}
            setShowInputIcon={setShowInputIcon}
            markerDistance={markerDistance}
            updateMarkerDistance={updateMarkerDistance}
          />
        )}
        {showRessourcePOI && (
          <RessourceMarkerForm
            marker={marker}
            showInputAudio={showInputAudio}
            showInputImage={showInputImage}
            showInputVideo={showInputVideo}
            setShowInputAudio={setShowInputAudio}
            setShowInputImage={setShowInputImage}
            setShowInputVideo={setShowInputVideo}
            markerImage={markerImage}
            markerVideo={markerVideo}
            markerAudio={markerAudio}
            markerImageName={markerImageName}
            markerVideoName={markerVideoName}
            markerAudioName={markerAudioName}
            setMarkerImage={setMarkerImage}
            setMarkerVideo={setMarkerVideo}
            setMarkerAudio={setMarkerAudio}
            setMarkerImageName={setMarkerImageName}
            setMarkerVideoName={setMarkerVideoName}
            setMarkerAudioName={setMarkerAudioName}
            mainResource={mainResource}
            setResourceArray={setResourceArray}
            resourceArray={resourceArray}
            setMainResource={setMainResource}
            handleAudioChange={handleAudioChange}
            handleVideoChange={handleVideoChange}
            handleImageChange={handleImageChange}
            handleDeleteAllAudio={handleDeleteAllAudio}
            handleDeleteAllImage={handleDeleteAllImage}
            handleDeleteAllVideo={handleDeleteAllVideo}
            updateAudioName={updateAudioName}
            updateImageName={updateImageName}
            updateVideoName={updateVideoName}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
            markerTitle={markerTitle}
            setMarkerTitle={setMarkerTitle}
            markerDescription={markerDescription}
            setMarkerDescription={setMarkerDescription}
            url={url}
            setUrl={setUrl}
          />
        )}
        {showQuizPOI && (
          <QuizMarkerForm
            marker={marker}
            markerOpenQuestion={markerOpenQuestion}
            setMarkerOpenQuestion={setMarkerOpenQuestion}
            markerQcmArray={markerQcmArray}
            setMarkerQcmArray={setMarkerQcmArray}
            handleInputFocus={handleInputFocus}
            handleInputBlur={handleInputBlur}
            markerQcmImageArray={markerQcmImageArray}
            setMarkerQcmImageArray={setMarkerQcmImageArray}
          />
        )}
      </div>
    </>
  );
};

export default TouristicMarkerForm;
