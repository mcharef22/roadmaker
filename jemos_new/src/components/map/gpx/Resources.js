export const parcoursTypes = {
  car: "Voiture",
  cycle: "Velo",
  pedestrian: "Rando",
  fast_forward: "Retour_rapide",
};
export const DEFAULT_LATITUDE = 48.005827232301; // coord du mans 
export const DEFAULT_LONGITUDE = 0.2031082116279; 

export const parcoursTravelModes = {
  Voiture: window.google.maps.TravelMode.DRIVING,
  Velo: window.google.maps.TravelMode.BICYCLING,
  Rando: window.google.maps.TravelMode.WALKING,
  Retour_rapide: window.google.maps.TravelMode.DRIVING,
};

export const strcuturePoiTagContent = {
  Voiture: `Reprise route. Activer le parcours en cliquant sur l'icône "panneaux" en bas à gauche`,
  Velo: "Nous vous proposons de poursuivre votre visite en Velo",
  Rando: "Nous vous proposons de poursuivre votre visite à pied",
  Retour_rapide: `<desc><![CDATA[Reprise route. Activer le parcours en cliquant sur l'icône "panneaux" en bas à gauche]]></desc>`,
};

export const strcuturePoiIcon = {
  Voiture: "10001",
  Velo: "10015",
  Rando: "10002",
  Retour_rapide: "10009",
};

export const packValue = {
  Standard: "Standard",
  Premium: "Premium",
};

export const iconsPaths = {
  rootFolder: "EML/",
  PI_structure: "/Structure.png",
  PI_touristic: "/contour.png",
  PI_standard: "/Info.png",
  Panorama: "/Panorama.png",
  Parking: "/Parking.png",
  Recharge: "/Recharge.png",
  Repas: "/Repas.png",
  Toilette: "/Toilette.png",
  Step: "/contour.png",
  Touristic: "/Touristic.png",
};

export const gpxStructure = {
  navigationPoints: [
    "Droite",
    "Gauche",
    "Tout droit",
    "Légèrement à droite",
    "Légèrement à gauche",
    "Tourner carément à droite",
    "Tourner carément à gauche",
    "Restez à droite",
    "Restez à gauche",
  ],
  standardPoints: {
    Voiture: [
      "Info1",
      "Panorama1",
      "Repas1",
      "Toilette1",
      "Parking",
      "Recharge",
    ],
    Rando: ["Info2", "Panorama2", "Repas2", "Toilette2"],
    Velo: ["Info3", "Repas3", "Toilette3", "Parking3", "Recharge3"],
    // à modifier (icones non fournies)
    Retour_rapide: ["Info1", "Repas1"],
  },
};
// mot clé indiquant que l'icone a déjà été supprimée. Son nom ne sera donc plus utlilisable.
export const ICON_INDEX_DELETED = "delete";
// valeur de l'indice de la première icone
export const DEFAULT_ICON_INDEX_ARRAY = "PI10040";
// préfixe du nom des icones dans customwpts
export const ICON_INDEX_PREFIX = "PI";
// valeur par defaut a donner aux distances avant l audio
export const DISTANCE_TO_TRIGGER_AUDIO = "160";
// valeur initial du iconIndexArray
export const INITIAL_ICON_INDEX_ARRAY = "Libre";

export const LOCAL_URL = "http://localhost:3000/";

export const TEST_URL = "https://road-maker.netlify.app/";

export const PROD_URL = "https://roadmaker.netlify.app/";

export const CONFIRMATION_LINK = "PageConfirmation?confirmed=true&userId=";

export const DOWNLOAD_FILES_ON_PHONE_LINK = "DownloadFilesOnPhone";

export const RESET_LINK = "PageReinitialiser?email=";

export const GITHUB_URL = "https://github.com/mcharef22/KMLFile/raw/main/";

export const KML_URL =
  "https://raw.githubusercontent.com/mcharef22/KMLFile/main/";

export const DEV_ENV = "development";

export const PROD_ENV = "production";

export const DEFAULT_EMPTY_TEXT = "";

export const URL_AUDIO =
  "https://raw.githubusercontent.com/mcharef22/audios/main/";

export const URL_VIDEO =
  "https://raw.githubusercontent.com/mcharef22/videos/main/";

// Contenu initial du fichier customwpts, à incrémenter à chaque fois qu'une icone est ajoutée
export const initialCustomWptsFile = `I
Voiture
Rando
Info1
Info2
Panorama1
Panorama2
Repas1
Repas2
Itinéraire retour rapide
Toilette1
Toilette2
Parking
Recharge
Velo
Info3
Panorama3
Repas3
Toilette3
Parking3
Recharge3
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
Libre
`.replace(/^\s+/gm, "");

export const indicationTypes = [
  "Gauche",
  "Droite",
  "Tout droit",
  "Retour",
  "Déviation à droite",
  "Déviation à gauche",
  "Continuer vers la droite",
  "Continuer vers la gauche",
  "Continuer tout droit",
  "1ère sortie",
  "2ème sortie",
  "3ème sortie",
  "4ème sortie",
  "5ème sortie",
  "Restez à droite",
  "Restez à gauche",
  "Légèrement à droite",
  "Légèrement à gauche",
  "Tourner carrément à droite",
  "Tourner carrément à gauche",
  "Audio",
];

export const USERS_ROUTE = "/users";
export const USER_ROUTE = "/user/";
export const PROJECT_ROUTE = "/project/";
export const POI_OF_PROJECT_ROUTE = "/poi/project/";
export const POI_ROUTE = "/poi/";
export const EMAIL_OF_USER_ROUTE = "/email/user";
export const DOWNLOAD_ROUTE = "/download";
export const UPLOAD_FILE_TO_GITHUB = "/uploadFileToGithub";
export const INVOICES_ROUTE = "/invoices";
export const BILLING_ADDRESS_ROUTE = "/billingAddress";
export const BILLING_ADDRESS_OF_USER_ROUTE = "/billingAddresses/user/";
export const INVOICE_BILLING_ADDRESS_ROUTE = "/invoiceBillingAddress/user/";
export const FILES_Route = "/files/";
export const PROJECT_OF_USER_ROUTE = "/projects/user/";

