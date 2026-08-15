import React from "react";
import DialogBoxWithConfirmation from "../../util/DialogBoxWithConfirmation";
import { useTranslation } from "react-i18next";
import "../../style/Marker.css";
import { useState } from "react";

const MarkerImage = ({
  markerImage,
  marker,
  setMarkerImage,
  markerImageName,
  setMarkerImageName,
  mainResource,
}) => {
  const { t } = useTranslation();
  const URL_IMAGE = "https://raw.githubusercontent.com/mcharef22/images/main/";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === marker.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? marker.image.length - 1 : prevIndex - 1
    );
  };

  /**
   * Permet de lancer la suppression d'une image du marqueur
   * @param {integer} index - Index de l'image à supprimer du marqueur
   */
  const handleDeleteImage = (index) => async (e) => {
    console.log("jest: Fonction de suppression est appelée");
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
      setMarkerImage(markerImage.filter((_, i) => i !== index));
      setMarkerImageName(markerImageName.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {markerImage &&
        markerImage.map((image, index) => (
          <div key={index}>
            <div>{markerImageName && markerImageName[index]}</div>
            <img
              alt="Image téléchargée"
              src={`${URL_IMAGE}${marker.id}${
                markerImageName
                  ? markerImageName[index]
                  : marker.imageName[index]
              }`}
              className="imageMarker"
            />
            <br />
            {(markerImage.length > 1 ||
              (markerImage.length === 1 && index === 0)) && (
              <>
                <button
                  type="button"
                  className="buttonDeleteFile me-2"
                  onClick={handleDeleteImage(index)}
                  aria-label="delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
                {markerImageName && markerImageName[index] === mainResource && (
                  <button type="button" className="buttonEditFile mt-3 mb-3"disabled>
                    <i className="bi bi-star"></i>
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      <div style={{ alignItems: "center", position: "relative" }}>
        {marker.image && !markerImage && marker.image.length > 0 && (
          <div>
            <div className="text-markerName">
              {marker.imageName && marker.imageName[currentImageIndex]}
            </div>
            <img
              alt="Image téléchargée"
              src={`${URL_IMAGE}${marker.id}${marker.imageName[currentImageIndex]}`}
              className="imageMarker"
            />
            <br />
            {marker.imageName &&
              marker.imageName[currentImageIndex] === marker.mainResource && (
                <button type="button" className="buttonEditFile mt-3 mb-3"disabled>
                  <i className="bi bi-star"></i>
                </button>
              )}
            <button
              type="button"
              onClick={handlePreviousImage}
              className="arrowButton left"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="arrowButton right"
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkerImage;
