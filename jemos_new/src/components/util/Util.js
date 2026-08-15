import { environnement } from "../../config";
import {
  DEV_ENV,
  LOCAL_URL,
  PROD_ENV,
  TEST_URL,
  PROD_URL,
} from "../map/gpx/Resources";
import { apiUrl } from "../../config";
import axios from "axios";

/**
 * Permet de remplacer les chiffres d'une chaîne de caractères par une chaîne vide
 * @param {string} str - Chaîne de caractères à modifier
 * @returns {string} Chaîne de caractères modifiée
 */

export function removeNumber(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/[0-9]/g, "");
}

/**
 * Permet de remplacer la valeur d'un titre par une valeur plus lisible
 * @param {string} str - Valeur du titre
 * @returns {string} Valeur du titre modifiée
 */
export function replaceValueForTitle(str) {
  if (typeof str !== "string") {
    return str;
  }
  const replacements = {
    Repas: "Zone de picnic",
    Toilette: "Toilettes",
    Info: "Info",
    "": "PI standard",
  };
  const strWithModif = str.replace(/[0-9]/g, "");
  return replacements[strWithModif] || strWithModif;
}

/**
 * Permet de générer un nombre aléatoire entre deux valeurs
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} Nombre aléatoire
 */
export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Permet de remplacer la valeur d'une description par une valeur plus lisible
 * @param {string} subTypeValue - Valeur de la description
 * @returns {string} Valeur de la description modifiée
 */
export function replaceValueForDescription(subTypeValue) {
  const substitutions = {
    Info: "Point d'information touristique",
    Toilette: "Toilettes publiques",
    Recharge: "Borne de recharge",
    Panorama: "Panorama",
    Repas: "Zone de picnic",
    Parking: "Parking",
  };
  // Vérifie si "subTypeValue" existe dans la liste des correspondances,
  // sinon retourne "subTypeValue" inchangé
  return substitutions[subTypeValue] || subTypeValue;
}

/**
 * Permet d'avoir la valeur de la distance en mètres
 * @param {string} str - Chaîne de caractères à modifier
 * @returns {string} Chaîne de caractères modifiée
 */

export function getDistanceValue(str) {
  if (typeof str !== "string") {
    return str;
  }
  if (str.includes("km")) {
    // Exemple distance = 0,2 km
    if (str.includes(",")) str += "00";
    // Exemple distance = 2 km
    else str += "000";
  }
  return str.replace(/[a-zA-Z ]/g, "");
}

/**
 * Permet de remplacer les majuscules par une chaîne vide
 * @param {string} str - Chaîne de caractères à modifier
 * @returns {string} Chaîne de caractères modifiée
 */

export function removeUpperCase(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/[A-Z]/g, "");
}

/**
 * Permet de remplacer le mot-clé "Repas" par "Zone de picnic"
 * @param {string} str - Chaîne de caractères à modifier
 * @returns {string} Chaîne de caractères modifiée
 */
export function replaceKeywordRepas(str) {
  if (typeof str !== "string") {
    return str;
  }
  let s = str.replace(/[0-9]/g, "");
  s = s.replace(/Repas/gi, "Zone de picnic");
  return s;
}

/**
 * Permet de remplacer tous les tags HTML par une chaîne vide
 * @param {string} text - Texte contenant des tags HTML
 * @returns {string} Texte sans tags HTML
 */
export function removeHtmlTags(text) {
  return text.replace(/<[^>]+>/g, "");
}

/**
 * Permet de formater une date au format "jj/mm/aaaa"
 * @param {string} date - Date
 * @returns {object} Date formatée
 */
export function formatDate(date, language) {
  const options = { day: "numeric", month: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString(language, options);
}

/**
 * Permet de formater une horaire au format "hh:mm"
 * @param {string} date - Date
 * @returns {object} Date + heure
 */
export function formatDateHour(date, language) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: language === "en" ? true : false,
  };
  const formattedHour = new Date(date).toLocaleTimeString(
    language,
    timeOptions
  );
  const formattedDate = new Date(date).toLocaleString(language, options);
  return formattedDate + " (" + formattedHour + ")";
}

/**
 * Permet de trier une liste d'éléments par date
 * @param {array} items - Liste des éléments à trier
 * @param {function} date - Fonction permettant de récupérer la date de l'élément
 * @param {string} sortOrder - Ordre de tri (asc ou desc)
 * @returns {array} Liste triée
 */
export function sortByDate(items, date, sortOrder) {
  return items.sort((a, b) => {
    if (sortOrder === "asc") {
      return date(a) - date(b);
    } else {
      return date(b) - date(a);
    }
  });
}

/**
 * Permet de filter les éléments d'une liste en fonction de critères
 * @param {array} items - Liste des éléments à filtrer
 * @param {array} filters - Liste des critères de filtrage
 * @returns {array}
 */
export function filterItems(items, filters) {
  return items.filter((item) => {
    return filters.every((filter) => {
      const { key, value } = filter;
      if (key === "name") {
        return (
          item.name && item.name.toLowerCase().includes(value.toLowerCase())
        );
      } else if (key === "admin" || key === "confirmed") {
        return value === "" || item[key] === (value === "true");
      } else if (key === "projectType" || key === "tag") {
        return value === "" || item[key] === value;
      } else {
        return true;
      }
    });
  });
}

/**
 * Permet de convertir un fichier GPX en fichier KML
 * @param {string} gpxContent - Contenu du fichier GPX
 * @returns {string}
 */

export function convertGpxToKml(gpxContent) {
  try {
    const xmlParser = require("xml-js");

    // Parse the GPX content
    const gpxData = xmlParser.xml2js(gpxContent, { compact: true });

    // Create a KML object
    const kmlData = {
      _declaration: {
        _attributes: {
          version: "1.0",
          encoding: "UTF-8",
        },
      },
      kml: {
        _attributes: {
          xmlns: "http://www.opengis.net/kml/2.2",
        },
        Document: {
          Placemark: {
            name: { _text: "GPX Track" },
            LineString: {
              coordinates: { _text: "" },
            },
          },
        },
      },
    };

    // Extract coordinates from GPX and add them to KML
    const coordinates = gpxData.gpx.trk.trkseg.trkpt.map((point) => {
      const lat = point._attributes.lat;
      const lon = point._attributes.lon;
      return `${lon},${lat}`;
    });

    kmlData.kml.Document.Placemark.LineString.coordinates._text =
      coordinates.join(" ");

    // Convert KML data back to XML
    const kmlXML = xmlParser.js2xml(kmlData, { compact: true, spaces: 2 });

    return kmlXML;
  } catch (error) {
    console.error("Error converting GPX to KML:", error);
    return null;
  }
}
/**
 * fonction pour nettoyer le nom des fichiers
 * @param {string} fileName - string à nettoyer
 */

export function normalizeFileName(fileName) {
  if (typeof fileName !== "string") {
    console.log(fileName);
    throw new Error(
      "Le paramètre fileName doit être une chaîne de caractères."
    );
  }

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const sanitized = removeAccents(fileName)
    .toLowerCase() // Optionnel : convertir en minuscules
    .replace(/[\/\\:*?"<>| ]/g, "_")
    .replace(/[^a-z0-9\s.-]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_/, "")
    .replace(/_$/, "");

  return sanitized;
}

export let url = "";

if (environnement === DEV_ENV) {
  url = LOCAL_URL;
} else if (environnement === PROD_ENV) {
  const currentHostname = window.location.hostname;

  if (currentHostname === new URL(TEST_URL).hostname) {
    url = TEST_URL;
  } else if (currentHostname === new URL(PROD_URL).hostname) {
    url = PROD_URL;
  }
}

/**
 * Permet de calculer le prix total du panier
 * @param {array} cart - Liste des produits du panier
 * @returns {number} Prix total du panier
 */

export function priceOfCart(cart) {
  return cart.reduce((total, product) => total + product.price, 0);
}

export async function uploadFileToGithub(file, markerId, githubRepo) {
  const formData = new FormData();
  formData.append("file", file);

  // Ajouter markerId uniquement s'il est fourni
  if (markerId) {
    formData.append("markerId", markerId);
  }

  formData.append("GITHUB_REPO", githubRepo);

  try {
    await axios.post(apiUrl + "/uploadFileToGithub", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-filename": normalizeFileName(file.name),
      },
    });
    console.log("Fichier téléchargé avec succès sur GitHub");
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du téléchargement du fichier:",
      error
    );
    throw error;
  }
}

export async function uploadBase64Image(
  base64Data,
  imageName,
  markerId,
  githubRepo
) {
  // Convertir l'image base64 en Blob
  const byteString = atob(base64Data.split(",")[1]);
  const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  const file = new File([blob], imageName, { type: mimeString });

  // Télécharger le fichier sur GitHub
  await uploadFileToGithub(file, markerId, githubRepo);
}

/**
 * appliquer le style de description
 */

export function handleTextStyle(
  style,
  setMarkerDescription,
  editorRef,
  isTextSelected
) {
  if (!isTextSelected()) return;
  document.execCommand(style, false, null);
  setMarkerDescription(editorRef.current.innerHTML);
}
