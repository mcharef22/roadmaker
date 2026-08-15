import React, { useState, useEffect, useContext } from "react";
import { markerTypes } from "../../map/MapWithMarker";
import TouristicMarkerForm from "./TouristicMarkerForm";
import InformationMarkerForm from "./InformationMarkerForm";
import html2canvas from "html2canvas";
import StructureMarkerForm from "./StructureMarkerForm";
import UserContext from "../../../../src/UserContext";
import {
  DEFAULT_ICON_INDEX_ARRAY,
  DISTANCE_TO_TRIGGER_AUDIO,
  ICON_INDEX_DELETED,
  ICON_INDEX_PREFIX,
  URL_AUDIO,
  URL_VIDEO,
} from "../../map/gpx/Resources";
import CheckBoxAudio from "./CheckBoxAudio";
import { normalizeFileName } from "../../util/Util";
import { useTranslation } from "react-i18next";
import DialogBox from "../../util/DialogBox";
import LoadingBox, { closeLoadingBox } from "../../util/LoadingBox";
import { uploadFileToGithub } from "../../util/Util";
import StyledText from "../../util/StyledText";

const MarkerEditionForm = (props) => {
  const {
    marker,
    selectedMarkerId,
    markers,
    setEditing,
    projectDatas,
    setEditedSubType,
    handleInputFocus,
    handleInputBlur,
    showConfigPOI,
    showRessourcePOI,
    showQuizPOI,
  } = props;
  const { t } = useTranslation();
  const GITHUB_REPO_VIDEOS = "videos";
  const GITHUB_REPO_AUDIOS = "audios";
  const GITHUB_REPO_IMAGES = "images";
  const GITHUB_REPO_ICONS = "icons";
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const { iconIndexArray, setIconIndexArray } = useContext(UserContext);

  const [markerTitle, setMarkerTitle] = useState(
    marker.title ? marker.title : ""
  );
  const [markerSubType, setMarkerSubType] = useState("");
  const [markerDescription, setMarkerDescription] = useState(
    marker.description ? marker.description : ""
  );
  const [markerAudio, setMarkerAudio] = useState(
    marker.audio ? marker.audio : []
  );
  const [markerVideo, setMarkerVideo] = useState(
    marker.video ? marker.video : []
  );
  const [markerImage, setMarkerImage] = useState(
    marker.image ? marker.image : []
  );
  const [markerIcon, setMarkerIcon] = useState(
    marker.iconImage ? marker.iconImage : ""
  );
  const [iconName, setIconName] = useState(
    marker.iconName ? marker.iconName : ""
  );
  const [iconNameWithoutBorder, setIconNameWithoutBorder] = useState(
    marker.iconNameWithoutBorder ? marker.iconNameWithoutBorder : ""
  );
  const [markerImageName, setMarkerImageName] = useState(
    marker.imageName ? marker.imageName : []
  );
  const [markerVideoName, setMarkerVideoName] = useState(
    marker.videoName ? marker.videoName : []
  );
  const [markerAudioName, setMarkerAudioName] = useState(
    marker.audioName ? marker.audioName : []
  );
  const [markerDistance, setMarkerDistance] = useState(
    marker.distanceToMarker
      ? marker.distanceToMarker
      : marker.checkAudio
        ? DISTANCE_TO_TRIGGER_AUDIO
        : -1
  );
  const [markerCheckAudio, setMarkerCheckAudio] = useState(
    marker.checkAudio ? marker.checkAudio : null
  );
  const [markerAccesValue, setMarkerAccesValue] = useState(
    marker.checkAcces ? marker.checkAcces : ""
  );
  const [showInputImage, setShowInputImage] = useState(false);
  const [showInputVideo, setShowInputVideo] = useState(false);
  const [showInputAudio, setShowInputAudio] = useState(false);
  const [showInputIcon, setShowInputIcon] = useState(false);
  const [markerToDownload, setMarkerToDownload] = useState(
    marker.markerToDownload ? marker.markerToDownload : ""
  );
  const imageArray = marker.imageName ? marker.imageName : [];
  const videoArray = marker.videoName ? marker.videoName : [];
  const audioArray = marker.audioName ? marker.audioName : [];
  const resources = [...imageArray, ...videoArray, ...audioArray];
  const [resourceArray, setResourceArray] = useState(
    marker.resourceArray ? marker.resourceArray : resources
  );
  const [mainResource, setMainResource] = useState(
    marker.mainResource
      ? marker.mainResource
      : marker.resourceArray
        ? marker.resourceArray[0]
        : ""
  );
  const [triggerType, setTriggerType] = useState(
    marker.triggerType ? marker.triggerType : ""
  );
  const [triggerDistance, setTriggerDistance] = useState(
    marker.triggerDistance ? marker.triggerDistance : null
  );

  const [url, setUrl] = useState(marker.url ? marker.url : "");
  const [markerOpenQuestion, setMarkerOpenQuestion] = useState(
    marker.openQuestionArray && marker.openQuestionArray.length > 0
      ? marker.openQuestionArray
      : []
  );
  const [markerQcmArray, setMarkerQcmArray] = useState(
    marker.qcmArray && marker.qcmArray.length > 0 ? marker.qcmArray : []
  );

  const [markerQcmImageArray, setMarkerQcmImageArray] = useState(
    marker.qcmImageArray && marker.qcmImageArray.length > 0
      ? marker.qcmImageArray
      : []
  );

  /**
   * Sauvegarde les informations du marker
   * @param {event} event - Validation du formulaire
   */

  const saveMarkerInfos = (event) => {
    console.log("jest: Appeller la fonction saveMarkerInfos");
    event.preventDefault();
    const markerToUpdate = markers.find(
      (marker) => marker.id === selectedMarkerId
    );
    if (markerToUpdate) {
      if (markerTitle) {
        markerToUpdate.title = markerTitle;
        setMarkerTitle("");
      }

      if (markerSubType) {
        markerToUpdate.subType = markerSubType;
        setMarkerSubType("");
      }

      if (markerDescription) {
        markerToUpdate.description = markerDescription;
        setMarkerDescription("");
      }

      if (markerDistance) {
        markerToUpdate.distanceToMarker = markerDistance;
        setMarkerDistance("");
      }

      if (mainResource) {
        markerToUpdate.mainResource = mainResource;
        setMainResource("");
      }

      if (
        markerAudio.every((audio) => audio === "") ||
        markerAudio.length > 0
      ) {
        markerToUpdate.audio = markerAudio;
      }

      if (
        markerVideo.every((video) => video === "") ||
        markerVideo.length > 0
      ) {
        markerToUpdate.video = markerVideo;
      }

      if (
        markerImage.length > 0 ||
        markerImage.every((image) => image === "")
      ) {
        markerToUpdate.image = markerImage;
      }

      if (markerIcon.includes("") || markerIcon.length > 0) {
        markerToUpdate.iconImage = markerIcon;
        markerToUpdate.iconName = iconName;
      }

      if (markerToDownload) {
        markerToUpdate.markerToDownload = markerToDownload;
      }

      if (markerImageName.includes("") || markerImageName.length > 0) {
        markerToUpdate.imageName = markerImageName;
        setMarkerImageName("");
      }

      if (markerVideoName.includes("") || markerVideoName.length > 0) {
        markerToUpdate.videoName = markerVideoName;
        setMarkerVideoName("");
      }

      if (markerAudioName.includes("") || markerAudioName.length > 0) {
        markerToUpdate.audioName = markerAudioName;
        setMarkerAudioName("");
      }

      if (iconNameWithoutBorder && (iconNameWithoutBorder.includes("") || iconNameWithoutBorder.length > 0)) {
        markerToUpdate.iconNameWithoutBorder = iconNameWithoutBorder;
        setIconNameWithoutBorder("");
      }

      if (resourceArray.includes("") || resourceArray.length > 0) {
        markerToUpdate.resourceArray = resourceArray;
        if (!mainResource) {
          markerToUpdate.mainResource = resourceArray[0];
        }
      }

      if (markerCheckAudio || !markerCheckAudio) {
        markerToUpdate.checkAudio = markerCheckAudio;
        setMarkerCheckAudio("");
      }

      if (markerAccesValue) {
        markerToUpdate.checkAcces = markerAccesValue;
        setMarkerAccesValue("");
      }
      if (triggerType) {
        markerToUpdate.triggerType = triggerType;
        setTriggerType("");
      }
      if (triggerDistance) {
        markerToUpdate.triggerDistance = triggerDistance;
        setTriggerDistance(null);
      }
      if (url !== undefined && url !== null) {
        markerToUpdate.url = url;
      } else if (url === "") {
        markerToUpdate.url = "";
      }

      setUrl(""); // Ne réinitialise l'URL que si elle a bien été mise à jour

      markerToUpdate.openQuestionArray = [...markerOpenQuestion];
      markerToUpdate.qcmArray = [...markerQcmArray];
      markerToUpdate.qcmImageArray = [...markerQcmImageArray];
    }
    setEditing(false);
  };

  /**
   * Génère l'icône du marker
   */

  const handleDownloadIcon = () => {
    const element = document.getElementById("marker-icon");
    html2canvas(element)
      .then((canvas) => {
        const link = document.createElement("a");
        link.download = "markericon.png";
        link.href = canvas
          .toDataURL("image/png")
          .replace(/^data:image\/[^;]/, "data:application/octet-stream");
        document.body.appendChild(link);
        setMarkerToDownload(link.href);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la génération de l'icône :",
          error
        );
      });
  };

  useEffect(() => {
    if (!resourceArray || resourceArray.length === 0) {
      setMainResource("");
    } else if (!resourceArray.includes(mainResource)) {
      setMainResource(resourceArray[0]);
    }
  }, [resourceArray, marker.resourceArray, mainResource]);

  // à améliorer (essayer promise au lieu du timeout)
  useEffect(() => {
    setTimeout(() => {
      handleDownloadIcon();
    }, 100);
  }, [markerIcon, markerAccesValue]);

  /**
   * Met à jour la distance du marker
   * @param {event} event - Modification de la distance
   */

  const updateMarkerDistance = (event) => {
    const newDistance = parseInt(event.target.value);
    setMarkerDistance(newDistance);
    if (newDistance > -1) {
      setMarkerCheckAudio(true);
    }
  };

  /**
   * Met à jour le nom de l'image
   * @param {event} event - Modification du nom de l'image
   */
  const updateImageName = (event) => {
    setMarkerImageName(event.target.value);
    setResourceArray(event.target.value);
  };

  /**
   * Met à jour le nom de la vidéo
   * @param {event} event - Modification du nom de la vidéo
   */
  const updateVideoName = (event) => {
    setMarkerVideoName(event.target.value);
    setResourceArray(event.target.value);
  };

  /**
   *  Met à jour le nom de l'audio
   * @param {event} event - Modification du nom de l'audio
   */
  const updateAudioName = (event) => {
    setMarkerAudioName(event.target.value);
    setResourceArray(event.target.value);
  };

  const updateIconNameWithoutBorder = (event) => {
    setIconNameWithoutBorder(event.target.value);
  };

  /**
   * Met à jour la checkbox audio
   * @param {event} event - Modification de la checkbox audio
   */
  const updateCheckAudio = (event) => {
    const newCheckAudio = event.target.checked;
    setMarkerCheckAudio(newCheckAudio);
    if (!newCheckAudio) {
      setMarkerDistance(-1);
    } else if (newCheckAudio) {
      setMarkerDistance(160);
    }
  };

  /**
   * Permet de mettre à jour l'image
   * @param {event} event - Modification de l'image
   */
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        // Afficher un message d'erreur si la taille du fichier dépasse 5 Mo
        DialogBox({
          text: t("fileSizeError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      LoadingBox({
        text: t("loadingAdd"),
        icon: "info",
      });

      try {
        await uploadFileToGithub(file, marker.id, GITHUB_REPO_IMAGES);
        // Le fichier a été téléchargé avec succès
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = reader.result;
          setMarkerImage([...markerImage, newImage]);
        };
        reader.readAsDataURL(file);

        const filePath = event.target.value;
        const fileName = filePath.split("\\").pop().split("/").pop();
        setMarkerImageName([...markerImageName, normalizeFileName(fileName)]);
        setResourceArray([...resourceArray, normalizeFileName(fileName)]);
        setShowInputImage(false);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la mise à jour de l'audio:",
          error
        );
      } finally {
        // Fermer le loading box
        closeLoadingBox();
      }
    }
  };

  /**
   * Permet de mettre à jour l'audio
   * @param {event} event - Modification de l'audio
   */
  const handleAudioChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        // Afficher un message d'erreur si la taille du fichier dépasse 5 Mo
        DialogBox({
          text: t("fileSizeError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Afficher le loading box
      LoadingBox({
        text: t("loadingAdd"),
        icon: "info",
      });
      try {
        await uploadFileToGithub(file, marker.id, GITHUB_REPO_AUDIOS);
        const filePath = event.target.value;
        const fileName = filePath.split("\\").pop().split("/").pop();
        // Le fichier audio a été téléchargé avec succès
        const newAudio = URL_AUDIO + marker.id + normalizeFileName(fileName);
        setMarkerAudio([...markerAudio, newAudio]);
        setMarkerAudioName([...markerAudioName, normalizeFileName(fileName)]);
        setResourceArray([...resourceArray, normalizeFileName(fileName)]);
        setShowInputAudio(false);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la mise à jour de l'audio:",
          error
        );
      } finally {
        // fermeture de loading box
        closeLoadingBox();
      }
    }
  };

  /**
   * Permet de mettre à jour la vidéo
   * @param {event} event - Modification de la vidéo
   */
  const handleVideoChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        // Afficher un message d'erreur si la taille du fichier dépasse 5 Mo
        DialogBox({
          text: t("fileSizeError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Afficher le loading box
      LoadingBox({
        text: t("loadingAdd"),
        icon: "info",
      });

      try {
        await uploadFileToGithub(file, marker.id, GITHUB_REPO_VIDEOS);
        const filePath = event.target.value;
        const fileName = filePath.split("\\").pop().split("/").pop();
        // Le fichier vidéo a été téléchargé avec succès
        const newVideo = URL_VIDEO + marker.id + normalizeFileName(fileName);
        setMarkerVideo([...markerVideo, newVideo]);
        setMarkerVideoName([...markerVideoName, normalizeFileName(fileName)]);
        setResourceArray([...resourceArray, normalizeFileName(fileName)]);
        setShowInputVideo(false);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la mise à jour de la vidéo:",
          error
        );
      } finally {
        // Fermer le loading box
        closeLoadingBox();
      }
    }
  };

  /**
   * Création du nom de l'icône
   */
  const createIconName = () => {
    let lastName, index, newIndex, iconName;
    lastName = iconIndexArray[iconIndexArray.length - 1];
    if (lastName === "Libre") return DEFAULT_ICON_INDEX_ARRAY;
    if (lastName.includes(ICON_INDEX_DELETED))
      index = parseInt(
        lastName.replace(ICON_INDEX_DELETED + ICON_INDEX_PREFIX, "")
      );
    else index = parseInt(lastName.replace(ICON_INDEX_PREFIX, ""));
    newIndex = index + 1;
    iconName = ICON_INDEX_PREFIX + newIndex;
    return iconName;
  };

  /**
   * Permet de mettre à jour l'icône
   * @param {event} event - Modification de l'icône
   */

  const handleIconChange = async (event) => {
    handleDownloadIcon();
    const file = event.target.files[0];

    if (file) {
      await uploadFileToGithub(file, marker.id, GITHUB_REPO_ICONS);
      // Le fichier icône a été téléchargé avec succès
      const reader = new FileReader();
      reader.onloadend = () => {
        setMarkerIcon(reader.result);
        setIconNameWithoutBorder(normalizeFileName(file.name));
        if (!marker.iconName || marker.iconName.length === 0) {
          setIconName(createIconName());
          iconIndexArray.push(createIconName()); // plus rapide que le hook setIconIndexArray [...iconIndexArray,createIconName()];
        }
      };
      reader.readAsDataURL(file);
      setShowInputIcon(false);
    }
  };
  return (
    <form onSubmit={saveMarkerInfos} data-testid="marker-form">
      {marker.type != markerTypes.touristic && (
        <>
          <label className="mt-4">{t("title")}</label>
          <StyledText markerText={markerTitle} setMarkerText={setMarkerTitle} />

          <label className="mt-4">{t("description")}</label>
          <StyledText
            markerText={markerDescription}
            setMarkerText={setMarkerDescription}
          />

          <div className="divLabelInput">
            <label className="mt-4">Distance</label>
            <input
              className="inputModifMarker"
              type="text"
              value={markerDistance ? markerDistance : null}
              onChange={updateMarkerDistance}
              aria-label="input-distance"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>
        </>
      )}
      {(marker.type === markerTypes.origin ||
        marker.type === markerTypes.destination) && (
        <CheckBoxAudio
          markerCheckAudio={markerCheckAudio}
          updateCheckAudio={updateCheckAudio}
        />
      )}
      {marker.type === markerTypes.touristic && (
        <TouristicMarkerForm
          marker={marker}
          handleImageChange={handleImageChange}
          handleVideoChange={handleVideoChange}
          handleAudioChange={handleAudioChange}
          handleIconChange={handleIconChange}
          updateImageName={updateImageName}
          updateVideoName={updateVideoName}
          updateAudioName={updateAudioName}
          updateIconNameWithoutBorder={updateIconNameWithoutBorder}
          updateMarkerDistance={updateMarkerDistance}
          markerImage={markerImage}
          markerAudio={markerAudio}
          markerVideo={markerVideo}
          markerIcon={markerIcon}
          projectDatas={projectDatas}
          setMarkerAudio={setMarkerAudio}
          setMarkerImage={setMarkerImage}
          setMarkerVideo={setMarkerVideo}
          setMarkerIcon={setMarkerIcon}
          markerCheckAudio={markerCheckAudio}
          setMarkerCheckAudio={setMarkerCheckAudio}
          markerAccesValue={markerAccesValue}
          setMarkerAccesValue={setMarkerAccesValue}
          updateCheckAudio={updateCheckAudio}
          markerImageName={markerImageName}
          markerVideoName={markerVideoName}
          markerAudioName={markerAudioName}
          iconNameWithoutBorder={iconNameWithoutBorder}
          setMarkerImageName={setMarkerImageName}
          setMarkerVideoName={setMarkerVideoName}
          setMarkerAudioName={setMarkerAudioName}
          showInputImage={showInputImage}
          setShowInputImage={setShowInputImage}
          showInputAudio={showInputAudio}
          setShowInputAudio={setShowInputAudio}
          showInputVideo={showInputVideo}
          setShowInputVideo={setShowInputVideo}
          showInputIcon={showInputIcon}
          setShowInputIcon={setShowInputIcon}
          resourceArray={resourceArray}
          mainResource={mainResource}
          setResourceArray={setResourceArray}
          setMainResource={setMainResource}
          triggerType={triggerType}
          setTriggerType={setTriggerType}
          triggerDistance={triggerDistance}
          setTriggerDistance={setTriggerDistance}
          url={url}
          setUrl={setUrl}
          showConfigPOI={showConfigPOI}
          showRessourcePOI={showRessourcePOI}
          showQuizPOI={showQuizPOI}
          handleInputFocus={handleInputFocus}
          handleInputBlur={handleInputBlur}
          markerTitle={markerTitle}
          setMarkerTitle={setMarkerTitle}
          markerDescription={markerDescription}
          setMarkerDescription={setMarkerDescription}
          markerDistance={markerDistance}
          markerOpenQuestion={markerOpenQuestion}
          setMarkerOpenQuestion={setMarkerOpenQuestion}
          markerQcmArray={markerQcmArray}
          setMarkerQcmArray={setMarkerQcmArray}
          markerQcmImageArray={markerQcmImageArray}
          setMarkerQcmImageArray={setMarkerQcmImageArray}
        />
      )}
      {marker.type === markerTypes.information && (
        <InformationMarkerForm
          marker={marker}
          projectDatas={projectDatas}
          setMarkerTitle={setMarkerTitle}
          markerSubType={markerSubType}
          setMarkerSubType={setMarkerSubType}
          setEditedSubType={setEditedSubType}
          markerCheckAudio={markerCheckAudio}
          updateCheckAudio={updateCheckAudio}
          setMarkerDescription={setMarkerDescription}
        />
      )}
      {marker.type === markerTypes.structure && (
        <StructureMarkerForm
          markerCheckAudio={markerCheckAudio}
          updateCheckAudio={updateCheckAudio}
        />
      )}
      <button
        type="submit"
        className="buttonModifMarker mt-2 w-50 p-2 "
        onClick={() => setEditedSubType(false)}
        aria-label="btn-enregistrer"
      >
        {t("save")}
      </button>
    </form>
  );
};

export default MarkerEditionForm;
