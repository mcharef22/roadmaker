import React from "react";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import { useTranslation } from "react-i18next";
import { URL_VIDEO } from "../../map/gpx/Resources";

const MarkerVideo = ({
  markerVideo,
  marker,
  setMarkerVideo,
  markerVideoName,
  setMarkerVideoName,
  mainResource,
}) => {
  const { t } = useTranslation();
  /**
   * Permet de lancer la suppression d'une vidéo du marqueur
   * @param {integer} index - Index de la vidéo à supprimer du marqueur
   */
  const handleDeleteVideo = (index) => async (e) => {
    console.log("jest: Fonction de suppression est appelée");
    e.stopPropagation();
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("deleteVideoText"),
      text: t("deleteVideoConfirmation"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });

    // Confirmer la suppression
    if (confirmDelete) {
      setMarkerVideo(markerVideo.filter((_, i) => i !== index));
      setMarkerVideoName(markerVideoName.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {markerVideo &&
        markerVideo.map((video, index) => (
          <div key={index}>
            <div>{markerVideoName && markerVideoName[index]}</div>
            <video controls className="videoInput">
              <source
                src={`${URL_VIDEO}${marker.id}${
                  markerVideoName
                    ? markerVideoName[index]
                    : marker.videoName[index]
                }`}
                type="video/mp4"
              />
            </video>
            <br />
            {(markerVideo.length > 1 ||
              (markerVideo.length === 1 && index === 0)) && (
              <>
                <button
                  type="button"
                  className="buttonDeleteFile mt-3 mb-3 me-2"
                  onClick={handleDeleteVideo(index)}
                  aria-label="delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
                {markerVideoName[index] === mainResource && (
                  <button type="button" className="buttonEditFile mt-3 mb-3"disabled>
                    <i className="bi bi-star"></i>
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      {!markerVideo &&
        marker.video &&
        marker.video.map((video, index) => (
          <div key={index}>
            <div>{marker.videoName && marker.videoName[index]}</div>
            <video controls className="videoInput">
              <source
                src={`${URL_VIDEO}${marker.id}${marker.videoName[index]}`}
                type="video/mp4"
              />
            </video>
            <br />
            {marker.videoName[index] === marker.mainResource && (
              <button type="button" className="buttonEditFile mt-3 mb-3"disabled>
                <i className="bi bi-star"></i>
              </button>
            )}
          </div>
        ))}
    </div>
  );
};

export default MarkerVideo;
