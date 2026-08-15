import React from "react";
import { useTranslation } from "react-i18next";
import MarkerAudio from "./MarkerAudio";
import MarkerImage from "./MarkerImage";
import MarkerVideo from "./MarkerVideo";
import UrlMarkerForm from "./UrlMarkerForm";
import StyledText from "../../util/StyledText";

const RessourceMarkerForm = ({
  marker,
  showInputAudio,
  showInputImage,
  showInputVideo,
  setShowInputAudio,
  setShowInputImage,
  setShowInputVideo,
  markerImage,
  markerVideo,
  markerAudio,
  markerImageName,
  markerVideoName,
  markerAudioName,
  setMarkerImage,
  setMarkerVideo,
  setMarkerAudio,
  setMarkerImageName,
  setMarkerVideoName,
  setMarkerAudioName,
  mainResource,
  setResourceArray,
  resourceArray,
  setMainResource,
  handleAudioChange,
  handleVideoChange,
  handleImageChange,
  handleDeleteAllAudio,
  handleDeleteAllImage,
  handleDeleteAllVideo,
  updateAudioName,
  updateImageName,
  updateVideoName,
  markerTitle,
  setMarkerTitle,
  markerDescription,
  setMarkerDescription,
  url,
  setUrl,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="m-4">
        <label className="mt-4">{t("title")}</label>
        <StyledText markerText={markerTitle} setMarkerText={setMarkerTitle} />

        <label className="mt-4">{t("description")}</label>
        <StyledText
          markerText={markerDescription}
          setMarkerText={setMarkerDescription}
        />
      </div>
      {/* /////////////////////////////////////////////affichage d'image ////////////////////////////////////////////////// */}
      <label className="mt-4">{t("picture")}</label>

      {markerImage && (
        <>
          <MarkerImage
            markerImage={markerImage}
            marker={marker}
            setMarkerImageName={setMarkerImageName}
            markerImageName={markerImageName}
            markerVideoName={markerVideoName}
            markerAudioName={markerAudioName}
            setMarkerImage={setMarkerImage}
            mainResource={mainResource}
            setResourceArray={setResourceArray}
            resourceArray={resourceArray}
          />
          {markerImage &&
            markerImage.length > 1 &&
            marker.image &&
            marker.image.length > 1 && (
              <>
                <button
                  type="button"
                  className="buttonDeleteFile mt-3 mb-3 w-50"
                  onClick={handleDeleteAllImage}
                >
                  {t("deleteAll")}
                </button>
                <br />
              </>
            )}
        </>
      )}
      {showInputImage && (
        <>
          <input
            type="hidden"
            value={markerImageName}
            onChange={updateImageName}
          />
          <input
            className="inputAddFile"
            type="file"
            aria-label="input-image"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={handleImageChange}
            multiple
          />
        </>
      )}

      {!showInputImage && (
        <>
          <button
            type="button"
            className="buttonModifMarker mt-1"
            onClick={() => setShowInputImage(true)}
            aria-label="btn-image"
          >
            {t("addPicture")}
          </button>
          <br />
        </>
      )}
      {/* /////////////////////////////////////////////affichage de video ////////////////////////////////////////////////// */}
      <br />
      <label className="mt-4">{t("video")}</label>
      {markerVideo && (
        <>
          <MarkerVideo
            markerVideo={markerVideo}
            marker={marker}
            setMarkerVideoName={setMarkerVideoName}
            markerImageName={markerImageName}
            markerVideoName={markerVideoName}
            markerAudioName={markerAudioName}
            setMarkerVideo={setMarkerVideo}
            mainResource={mainResource}
            setResourceArray={setResourceArray}
          />
          {markerVideo &&
            markerVideo.length > 1 &&
            marker.video &&
            marker.video.length > 1 && (
              <>
                <button
                  type="button"
                  className="buttonDeleteFile mt-3 mb-3 w-50"
                  onClick={handleDeleteAllVideo}
                >
                  {t("deleteAll")}
                </button>
                <br />
              </>
            )}
        </>
      )}
      {showInputVideo && (
        <>
          <input
            type="hidden"
            value={markerVideoName}
            onChange={updateVideoName}
          />
          <input
            className="inputAddFile"
            type="file"
            aria-label="input-video"
            accept=".mp4, .mov"
            onChange={handleVideoChange}
            multiple
          />
        </>
      )}
      {!showInputVideo && (
        <>
          <button
            type="button"
            className="buttonModifMarker mt-1"
            onClick={() => setShowInputVideo(true)}
            aria-label="btn-video"
          >
            {t("addVideo")}
          </button>
        </>
      )}
      {/* /////////////////////////////////////////////affichage d'audio ////////////////////////////////////////////////// */}
      <br />
      <label className="mt-4">Audio</label>

      {markerAudio && (
        <>
          <MarkerAudio
            markerAudio={markerAudio}
            marker={marker}
            setMarkerAudioName={setMarkerAudioName}
            markerImageName={markerImageName}
            markerVideoName={markerVideoName}
            markerAudioName={markerAudioName}
            setMarkerAudio={setMarkerAudio}
            mainResource={mainResource}
            setResourceArray={setResourceArray}
          />
          {markerAudio &&
            markerAudio.length > 1 &&
            marker.audio &&
            marker.audio.length > 1 && (
              <>
                <button
                  type="button"
                  className="buttonDeleteAll mt-3 mb-3"
                  onClick={handleDeleteAllAudio}
                >
                  {t("deleteAll")}
                </button>
                <br />
              </>
            )}
        </>
      )}
      {showInputAudio && (
        <>
          <input
            type="hidden"
            value={markerAudioName}
            onChange={updateAudioName}
          />
          <input
            className="inputAddFile"
            type="file"
            aria-label="input-audio"
            accept="audio/*"
            onChange={handleAudioChange}
            multiple
          />
        </>
      )}
      {!showInputAudio && (
        <>
          <button
            type="button"
            className="buttonModifMarker mt-1"
            onClick={() => setShowInputAudio(true)}
            aria-label="btn-audio"
          >
            {t("addAudio")}
          </button>
          <br />
        </>
      )}
      <div>
        <label className="mt-4">{t("mainResource")}</label>
        <select
          className="selectMarker"
          value={mainResource}
          onChange={(event) => setMainResource(event.target.value)}
          aria-label="input-MainResource"
        >
          <option value="">--{t("selectResource")}--</option>
          {resourceArray &&
            resourceArray.map((resource, index) => (
              <option key={index} value={resource}>
                {resource}
              </option>
            ))}
        </select>
      </div>

      <UrlMarkerForm url={url} setUrl={setUrl} />
    </>
  );
};
export default RessourceMarkerForm;
