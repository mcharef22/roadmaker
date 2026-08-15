import React from "react";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import { useTranslation } from "react-i18next";
import { URL_AUDIO } from "../../map/gpx/Resources";

const MarkerAudio = ({
  markerAudio,
  marker,
  setMarkerAudio,
  markerAudioName,
  setMarkerAudioName,
  mainResource,
}) => {
  const { t } = useTranslation();
  /**
   * Permet de lancer la suppression d'un fichier audio du marqueur
   * @param {integer} index - Index du fichier audio à supprimer du marqueur
   */
  const handleDeleteAudio = (index) => async (e) => {
    console.log("jest: Fonction de suppression est appelée");
    e.stopPropagation();
    const confirmDelete = await DialogBoxWithConfirmation({
      title: t("deleteAudioText"),
      text: t("deleteAudioConfirmation"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });

    // Confirmer la suppression
    if (confirmDelete) {
      setMarkerAudio(markerAudio.filter((_, i) => i !== index));
      setMarkerAudioName(markerAudioName.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {markerAudio &&
        markerAudio.map((audio, index) => (
          <div key={index}>
            <div>{markerAudioName && markerAudioName[index]}</div>
            <audio controls className="audioInput">
              <source
                src={`${URL_AUDIO}${marker.id}${
                  markerAudioName
                    ? markerAudioName[index]
                    : marker.audioName[index]
                }`}
                type="audio/mpeg"
              />
            </audio>
            <br />
            {(markerAudio.length > 1 ||
              (markerAudio.length === 1 && index === 0)) && (
              <>
                <button
                  type="button"
                  className="buttonDeleteFile mt-3 mb-3 me-2"
                  onClick={handleDeleteAudio(index)}
                  aria-label="delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
                {markerAudioName && markerAudioName[index] === mainResource && (
                  <button type="button" className="buttonEditFile mt-3 mb-3"disabled>
                    <i className="bi bi-star"></i>
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      {!markerAudio &&
        marker.audio &&
        marker.audio.map((audio, index) => (
          <div key={index}>
            <div>{marker.audioName && marker.audioName[index]}</div>
            <audio controls className="audioInput">
              <source
                src={`${URL_AUDIO}${marker.id}${marker.audioName[index]}`}
                type="audio/mpeg"
              />
            </audio>
            <br />
            {marker.audioName &&
              marker.audioName[index] === marker.mainResource && (
                <button type="button" className="buttonEditFile mt-3 mb-3"disabled>
                  <i className="bi bi-star"></i>
                </button>
              )}
          </div>
        ))}
    </div>
  );
};

export default MarkerAudio;
