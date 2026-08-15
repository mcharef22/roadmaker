import {
  ICON_INDEX_PREFIX,
  initialCustomWptsFile,
  strcuturePoiIcon,
} from "../../gpx/Resources";
import { sendFileToPhone, createBlob } from "./SendFilesToPhone";
import { removeHtmlTags, getDistanceValue } from "../../../util/Util";
import { apiUrl } from "../../../../config";
import DialogBox from "../../../util/DialogBox";
import axios from "axios";
import { LoadingBoxWithProgressBar } from "../../../util/LoadingBox";
import { generateGPXEMLFile } from "./GpxTemplates";

/**
 * Traduit les instructions de navigation en français
 * @param {string} maneuver - Manoeuvre de navigation
 * @param {string} instructions - Instructions de navigation
 * @returns {object} translations - Traductions des instructions de navigation
 */
export const translateManeuver = (maneuver, instructions) => {
  const getRoundaboutExitText = (string) => {
    const match = string.match(/\d+/);
    if (match && match[0]) {
      // Vérifier si match renvoie une valeur non nulle
      const exitNumber = parseInt(match[0]);
      if (exitNumber == 1) return "1ère Sortie";
      else if (exitNumber > 1 && exitNumber < 6)
        return exitNumber + "ème Sortie";
      else return "";
    }
  };
  const translations = {
    "turn-right": "Droite",
    "turn-left": "Gauche",
    straight: "Tout droit",
    "turn-slight-right": "Légèrement à droite",
    "turn-slight-left": "Légèrement à gauche",
    "turn-sharp-right": "Tourner carément à droite",
    "turn-sharp-left": "Tourner carément à gauche",
    "roundabout-right": () => {
      return getRoundaboutExitText(instructions);
    },
    "roundabout-left": () => {
      return getRoundaboutExitText(instructions);
    },
    "keep-right": "Restez à droite",
    "keep-left": "Restez à gauche",
    Audio: "Audio",
  };
  return translations[maneuver]
    ? typeof translations[maneuver] === "function"
      ? translations[maneuver]()
      : translations[maneuver]
    : "";
};

const subTypeNumber = (subType) => {
  const typeNumbers = {
    Info1: "10003",
    Info2: "10004",
    Info3: "10016",
    Panorama1: "10005",
    Panorama2: "10006",
    Panorama3: "10017",
    Repas1: "10007",
    Repas2: "10008",
    Toilettes1: "10011",
    Toilettes2: "10012",
    Toilettes3: "10019",
    Parking: "10013",
    Parking3: "10020",
    Recharge: "10014",
    Recharge3: "10021",
  };
  return typeNumbers[subType] || null;
};

export const trkType = (parcoursType) => {
  const typeColors = {
    Voiture: "#0000FF",
    Rando: "#00AE00",
    "Retour rapide": "#D152D7",
    Velo: "#FF5733",
  };
  return typeColors[parcoursType] || null;
};

const iconNumber = (type) => {
  const iconNumbers = {
    Audio: "10000",
    Gauche: "1000",
    Droite: "1001",
    "Tout droit": "1002",
    Retour: "1003",
    "Déviation à droite": "1004",
    "Déviation à gauche": "1005",
    "Continuer vers la droite": "1006",
    "Continuer vers la gauche": "1007",
    "Continuer tout droit": "1008",
    "1ère Sortie": "1009",
    "2ème Sortie": "1010",
    "3ème Sortie": "1011",
    "4ème Sortie": "1012",
    "5ème Sortie": "1013",
    "Restez à droite": "1014",
    "Restez à gauche": "1015",
    "Légèrement à droite": "1016",
    "Légèrement à gauche": "1017",
    "Tourner carrément à droite": "1018",
    "Tourner carrément à gauche": "1019",
    Info1: "10003",
    Info2: "10004",
  };
  return iconNumbers[type] || null;
};
/**
 * Envoie le fichier GPX à la tablette via la fonction sendFileToPhone
 * @param {string} GPXFile - Fichier GPX
 * @param {string} projectName - Nom du projet
 * @param {string} apiUrl - URL de l'API
 */
const sendGPX = (GPXFile, projectName, apiUrl, sendToPhone) => {
  const blobGPX = new Blob([GPXFile], { type: "text/plain" });
  const url = sendToPhone ? "/uploadGPX" : "/uploadGPXonServer";
  sendFileToPhone(blobGPX, projectName + ".gpx", apiUrl + url, "GPX");
};

/**
 * Permet d'envoyer le fichier TXT à la tablette via la fonction sendFileToPhone
 * @param {string} customWptsFile - fichier des points de navigation customisés
 * @param {string} apiUrl - URL de l'API
 */
const sendTxt = (customWptsFile, apiUrl, sendToPhone) => {
  const blobTxt = new Blob([customWptsFile], { type: "text/plain" });
  const url = sendToPhone ? "/uploadTxt" : "/uploadTxtonServer";
  sendFileToPhone(blobTxt, "customwpts.txt", apiUrl + url, "TXT");
};

/**
 * Permet d'envoyer les icones des markers à la tablette via la fonction sendFileToPhone
 * @param {array} markers - Tableau des markers
 * @param {string} apiUrl - URL de l'API
 * @param {array} markerTypes - Tableau des types de markers
 */
const sendImages = (markers, apiUrl, markerTypes, sendToPhone) => {
  markers.forEach(async (marker) => {
    if (marker.markerToDownload) {
      const iconUrl = marker.markerToDownload;
      const iconName = marker.iconName + ".png";
      const iconBlob = await createBlob(iconUrl);
      const url = sendToPhone ? "/uploadIcon" : "/uploadIcononServer";
      marker.markerToDownload.length > 0 &&
        sendFileToPhone(iconBlob, iconName, apiUrl + url, "icon");
    }
  });

  //Utilisation pour l'envoie des images marker touristic
  markers.forEach(async (marker) => {
    if (marker.type === markerTypes.touristic && marker.image) {
      if (Array.isArray(marker.imageName)) {
        marker.imageName.forEach(async (imageName, index) => {
          const imageUrl = marker.image[index];
          const imageBlob = await createBlob(imageUrl);
          const url = sendToPhone ? "/uploadImage" : "/uploadImageonServer";
          if (imageName.length > 0) {
            sendFileToPhone(imageBlob, imageName, apiUrl + url, "image");
          }
        });
      }
    }
  });

  markers.forEach(async (marker) => {
    if (marker.audio) {
      if (Array.isArray(marker.audioName)) {
        marker.audioName.forEach(async (audioName, index) => {
          const audioUrl = marker.audio[index];
          const audioBlob = await createBlob(audioUrl);
          const url = sendToPhone ? "/uploadAudio" : "/uploadAudioonServer";
          if (audioName.length > 0) {
            sendFileToPhone(audioBlob, audioName, apiUrl + url, "audio");
          }
        });
      }
    }
  });

  markers.forEach(async (marker) => {
    if (marker.video) {
      if (Array.isArray(marker.videoName)) {
        marker.videoName.forEach(async (videoName, index) => {
          const videoUrl = marker.video[index];
          const videoBlob = await createBlob(videoUrl);
          const url = sendToPhone ? "/uploadVideo" : "/uploadVideoonServer";
          if (videoName.length > 0) {
            sendFileToPhone(videoBlob, videoName, apiUrl + url, "video");
          }
        });
      }
    }
  });
};

export const CompileProject = async (
  projectName,
  customNavigationPoints,
  markers,
  markerTypes,
  originMarker,
  destinationMarker,
  destinationSameAsOrigin,
  trkseg,
  parcoursType,
  iconIndexArray,
  coordinates,
  sendToDevice,
  sendFileToServer
) => {
  var customWptsFile = initialCustomWptsFile;
  var formattedIndexArray = iconIndexArray
    .map(function (valeur) {
      return valeur + "\n";
    })
    .join("");
  customWptsFile += formattedIndexArray;

  /**
   * Télécharge toutes les icônes des markers
   */
  const downloadAllMarkersIcons = () => {
    markers.forEach((marker) => {
      if (marker.markerToDownload) {
        const link = document.createElement("a");
        link.download = marker.iconName + ".png";
        link.href = marker.markerToDownload;
        link.click();
      }
    });
  };

  /**
   * Télécharge un fichier texte
   * @param {string} text - Texte à télécharger
   * @param {string} name - Nom du fichier
   */
  const downloadTextFile = (text, name) => {
    const cleanText = text.replaceAll(",", "");
    const blob = new Blob([cleanText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    link.click();
  };

  const frenshTypes = [
    "Gauche",
    "Droite",
    "Tout droit",
    "Retour",
    "Déviation à droite",
    "Déviation à gauche",
    "Continuer vers la droite",
    "Continuer vers la gauche",
    "Continuer tout droit",
    "1ère Sortie",
    "2ème Sortie",
    "3ème Sortie",
    "4ème Sortie",
    "5ème Sortie",
    "Restez à droite",
    "Restez à gauche",
    "Légèrement à droite",
    "Légèrement à gauche",
    "Tourner carément à droite",
    "Tourner carément à gauche",
    "Audio",
  ];

  const GPXFile = generateGPXEMLFile(
    projectName,
    customNavigationPoints,
    markers,
    markerTypes,
    originMarker,
    destinationMarker,
    destinationSameAsOrigin,
    trkseg,
    parcoursType,
    frenshTypes,
    coordinates,
    removeHtmlTags,
    translateManeuver,
    iconNumber,
    getDistanceValue,
    subTypeNumber,
    ICON_INDEX_PREFIX,
    strcuturePoiIcon,
    trkType
  );

  if (!sendToDevice && !sendFileToServer) {
    downloadTextFile(GPXFile, projectName + ".gpx");
    downloadTextFile(customWptsFile, "customwpts.txt");
    downloadAllMarkersIcons();
  }

  if (!sendToDevice && sendFileToServer) {
    try {
      // Supprimer le dossier du serveur s'il existe déjà
      await axios.delete(apiUrl + "/deleteRepository");
      // Le reste du code sera exécuté après la suppression réussie
      sendGPX(GPXFile, projectName, apiUrl, false);
      sendTxt(customWptsFile, apiUrl, false);
      sendImages(markers, apiUrl, markerTypes, false);
    } catch (error) {
      console.error("Erreur lors de la suppression du dossier :", error);
    }
  }

  if (sendToDevice && !sendFileToServer) {
    // Vérifier la connexion de la tablette
    const checkTabletConnection = () => {
      return axios.get(apiUrl + "/checkTabletConnection");
    };
    // Effectuer la vérification de la connexion avant d'envoyer les fichiers
    checkTabletConnection()
      .then((response) => {
        LoadingBoxWithProgressBar();
        if (response.data.connected) {
          // Utilisation pour envoyer le fichier GPX
          sendGPX(GPXFile, projectName, apiUrl);
          // Utilisation pour envoyer le fichier TXT
          sendTxt(customWptsFile, apiUrl);

          //Utilisation pour l'envoie des icons
          sendImages(markers, apiUrl, markerTypes);
        } else {
          // La tablette n'est pas connectée, affichez un message d'erreur
          DialogBox({
            text: "Veuillez vérifier que le RoadPlayer est connecté et que le mode debugage est activé",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la vérification de la connectivité de la tablette:",
          error
        );
      });
  }
};
