import React, { useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  DirectionsRenderer,
  InfoWindow,
  KmlLayer,
} from "react-google-maps";
import PlacesAutocomplete from "react-places-autocomplete";
import axios from "axios";
import { useEffect } from "react";
import { CompileProject } from "./mapBox/mapBoxFeatures/CompileProject";
import { ExportProject } from "./mapBox/mapBoxFeatures/ExportProject";

import UserContext from "../../../src/UserContext";
import { CustomNavigation } from "./customNavigation/CustomNavigation";
import Indice from "../screens/Indice";
import ContextMenu from "./ContextMenu";
import MapBoxSize from "./mapBox/MapBoxSize";
import CoordinatesAlert from "./CoordinatesAlert";
import CalculateRouteButtons from "./mapBox/CalculateRouteButtons";
import MapBoxOptions from "./mapBox/MapBoxOptions";
import MapBoxFeatures from "./mapBox/mapBoxFeatures/MapBoxFeatures";
import DialogBoxWithConfirmation from "../util/DialogBoxWithConfirmation";
import DialogBox from "../util/DialogBox";
import { LoadingBox } from "../util/LoadingBox";
import { closeLoadingBox } from "../util/LoadingBox";
import { convertGpxToKml } from "../util/Util";
import InfoPointMenu from "./InfoPointMenu";
import {
  DISTANCE_TO_TRIGGER_AUDIO,
  ICON_INDEX_DELETED,
  iconsPaths,
  parcoursTravelModes,
  GITHUB_URL,
  KML_URL,
  POI_OF_PROJECT_ROUTE,
  POI_ROUTE,
  PROJECT_ROUTE,
  USER_ROUTE,
  UPLOAD_FILE_TO_GITHUB,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
} from "./gpx/Resources";
import { SendGpx } from "./mapBox/mapBoxFeatures/GpxToServ";
import { removeNumber } from "../util/Util";
import StepBox from "./stepBox/StepBox";
import "./MapWithMarkers.css";
import { calculateGPXRoute } from "./mapBox/mapBoxFeatures/ImportProject";
import DialogBoxWithFooter from "../util/DialogBoxWithFooter";
import { useTranslation } from "react-i18next";
import "../style/CalculateRouteContainer.css";
import { apiUrl } from "../../config";

export const markerTypes = {
  origin: "origin",
  destination: "destination",
  step: "step",
  navigation: "navigation",
  information: "information",
  touristic: "touristic",
  structure: "structure",
};

/**
 * Création de l'objet MapWithAMarker qui est la carte avec les marqueurs
 * @param {object} props
 * @param {object} projectDatas
 *
 */

export const MapWithAMarker = withGoogleMap((props, projectDatas, userData) => (
  <GoogleMap
    center={props.position}
    zoom={props.zoom}
    onClick={props.onMapClick}
    options={{
      styles: props.poiLabels,
      gestureHandling: "greedy", // pour zoomer directement avec la molette
      scaleControl: true, // afficher l'échelle du zoom
    }}
  >
    {props.infoCustomNavig ? (
      <InfoWindow
        position={{
          lat: parseFloat(props.mapPosition.lat),
          lng: parseFloat(props.mapPosition.lng),
        }}
        onCloseClick={props.fermerInfoWindow}
      >
        <div>{props.infoCustomNavig}</div>
      </InfoWindow>
    ) : null}

    {props.markers.map((marker) => (
      <Marker
        key={marker.id}
        position={{ lat: marker.lat, lng: marker.lng }}
        icon={
          marker.type === markerTypes.information && marker.subType === ""
            ? props.markerIcons["Info"]
            : marker.type === markerTypes.information
            ? props.markerIcons[removeNumber(marker.subType)]
            : props.markerIcons[marker.type]
        }
        draggable={true}
        onDragEnd={(event) => props.onMarkerDragEnd(marker.id, event)}
        distanceToMarker={marker.distanceToMarker}
        subType={marker.subType}
        Project_id={projectDatas._id}
        onClick={(event) => props.onMarkerClick(marker.id, event)}
        animation={
          marker.id === props.selectedMarkerId &&
          window.google.maps.Animation.BOUNCE
        }
      />
    ))}

    {props.directionsResponse && (
      <DirectionsRenderer
        directions={props.directionsResponse}
        suppressMarkers={props.markers}
        routeIndex={props.selectedRoute}
        panel={document.getElementById("directions-panel")}
        onRouteChange={props.handleRouteChange}
      />
    )}

    {props.kmlFile && (
      <KmlLayer
        key={props.kmlLayerKey}
        url={props.kmlFile}
        options={{
          suppressInfoWindows: true,
        }}
      />
    )}
  </GoogleMap>
));

export default function MapWithMarker({
  projectDatas,
  userData,
  titleOfProject,
  userPack,
  setVisibleComponent,
}) {
  /* CONSTANTES UTILISÉS PAR LE COMPOSANT */
  const initialPosition = { lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE };
  const initialZoom = 7;
  const ergonomicZoom = 13;
  const notSelectedButtonStyle = "m-2 btn btn-light";
  const selectedButtonStyle = "m-2 btn btn-success";

  const showAllLabels = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "transit.station",
      elementType: "all",
      stylers: [{ visibility: "on" }],
    },
  ];
  const hideAllLabels = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit.station",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ];

  const structureIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.PI_structure;
  const informationIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.PI_standard;
  const panoramaIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Panorama;
  const parkingIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Parking;
  const rechargeIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Recharge;
  const repasIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Repas;
  const toiletteIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Toilette;
  const stepIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Step;
  const touristicIconPath =
    iconsPaths.rootFolder + projectDatas.projectType + iconsPaths.Touristic;

  const markerIcons = {
    origin: structureIconPath,
    destination: structureIconPath,
    structure: structureIconPath,
    Info: informationIconPath,
    Parking: parkingIconPath,
    Panorama: panoramaIconPath,
    Recharge: rechargeIconPath,
    Repas: repasIconPath,
    Toilette: toiletteIconPath,
    step: stepIconPath,
    navigation: "poi-inter.png",
    touristic: touristicIconPath,
  };

  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [originMarker, setOriginMarker] = useState({});
  const [destinationMarker, setDestinationMarker] = useState({});
  const [stepMarkers, setStepMarkers] = useState({});
  const [selectedMarkerId, setSelectedMarkerId] = useState("");
  const [selectedMarkerType, setSelectedMarkerType] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [trkseg, setTrkseg] = useState([]); // pour les points du tracé
  const [customNavigationPoints, setCustomNavigationPoints] = useState([]); // les pts de navigation d'un itinéraire
  const [customIndicationsEdited, setCustomIndicationsEdited] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({});
  const [infoCustomNavig, setInfoCustomNavig] = useState(""); // type étape qui s'affiche dans infoWindow
  const [mapPosition, setMapPosition] = useState(initialPosition);
  const [zoom, setZoom] = useState(initialZoom);
  const [mapDimensions, setMapDimensions] = useState({
    height: "96%",
    width: "95%",
  });
  const [poiLabels, setPoilLabels] = useState(hideAllLabels);
  const [placeInput, setPlaceInput] = useState();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [travelMode, setTravelMode] = useState(
    window.google.maps.TravelMode[parcoursTravelModes[projectDatas.projectType]]
  );
  const [optimizeWaypoints, setOptimizeWaypoints] = useState(true);
  const [avoidHighways, setAvoidHighways] = useState(true);
  const [classCompilationButton, setClassCompilationButton] =
    useState("invisible");
  const [refreshMap, setRefreshMap] = useState("invisible");
  const [initialButtonNavigationsVisibility, setInitialNavigationButtonClass] =
    useState("invisibleButtons");
  const [customNavigationButtonClass, setCustomNavigationButtonClass] =
    useState(
      projectDatas.kmlFile ? "btn btn-outline-danger mt-4" : "invisibleButtons"
    );
  const [sendData, setSendData] = useState("invisible");
  const [navigationPanelVisibility, setNavigationPanelVisibility] = useState({
    height: "482px",
    width: "100%",
    display: "none",
  });
  const [
    navigationPanelVisibilityIsActif,
    setNavigationPanelVisibilityIsActif,
  ] = useState(false); // False au début
  const [
    customNavigationPanelVisibilityIsActif,
    setCustomNavigationPanelVisibilityIsActif,
  ] = useState(false); // False au début

  const [customNavigationPanelVisibility, setCustomNavigationPanelVisibility] =
    useState({ height: "482px", width: "100%", display: "none" });

  const toggleCustomNavigationPanel = () => {
    // Si le panneau custom est activé, on cache le panneau normal
    setCustomNavigationPanelVisibilityIsActif((prevState) => !prevState);
    setCustomNavigationPanelVisibility((prevState) => ({
      ...prevState,
      display: prevState.display === "block" ? "none" : "block",
    }));

    // Désactiver l'autre panneau si le custom est activé
    if (!customNavigationPanelVisibilityIsActif) {
      setNavigationPanelVisibilityIsActif(false);
      setNavigationPanelVisibility((prevState) => ({
        ...prevState,
        display: "none",
      }));
    }
  };

  const toggleNavigationPanel = () => {
    // Si le panneau normal est activé, on cache le panneau custom
    setNavigationPanelVisibilityIsActif((prevState) => !prevState);
    setNavigationPanelVisibility((prevState) => ({
      ...prevState,
      display: prevState.display === "block" ? "none" : "block",
    }));

    // Désactiver l'autre panneau si le normal est activé
    if (!navigationPanelVisibilityIsActif) {
      setCustomNavigationPanelVisibilityIsActif(false);
      setCustomNavigationPanelVisibility((prevState) => ({
        ...prevState,
        display: "none",
      }));
    }
  };

  const [copiedCoordinates, setCopiedCoordinates] = useState(false);
  const [poly, setPoly] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [path, setPath] = useState({});
  const [kmlFile, setKmlFile] = useState(projectDatas.kmlFile);
  const [urlKmlToFetsh, setUrlKmlToFetsh] = useState(
    projectDatas.urlKmlToFetsh
  );
  const [downloadTime, setDownloadTime] = useState(null);
  const [kmlLayerKey, setKmlLayerKey] = useState(0);
  const [showInputKML, setShowInputKML] = useState(false);
  const [showInputGPX, setShowInputGPX] = useState(false);
  const [showInputGPXKml, setShowInputGPXKml] = useState(false);
  const [selectedMarkerToDelete, setSelectedMarkerToDelete] = useState("");

  // const [coordinates, setCoordinates] = useState([]);
  const [showInfoPointMenu, setShowInfoPointMenu] = useState(false);
  const [editedSubType, setEditedSubType] = useState(false);
  const [destinationSameAsOrigin, setDestinationSameAsOrigin] = useState(
    projectDatas.destinationSameAsOrigin
      ? projectDatas.destinationSameAsOrigin
      : false
  );
  const [iconIndexArray, setIconIndexArray] = useState(userData.iconIndexArray);
  const [KmlCoordinates, setKmlCoordiantes] = useState([]);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { t } = useTranslation();
  const GITHUB_REPO = "KMLFile";
  const GPX_TO_KML_FILE_EXTENSION = "_gpxTokmlFile.kml";
  const KML_File_EXTENSION = "_kmlFile.kml";
  const TOURISTIC_POI = "PI touristique";
  const FREE_ACCESS = "Gratuit";
  const MANUAL_TRIGGER = "Manuel";
  const MINIMAL_RADIUS = 5;
  const START_POI = "Point de départ";
  const END_POI = "Point de destination";
  const NAVIGATION_POI = "Point de navigation";
  const INFORMATION_POI = "PI standard";
  const LOGO_CONNEXION_IMG = "/rm_imgs/logo_connexion.png";

  useEffect(() => {
    /**
     * Permet de récupérer les données du fichier KML
     */
    const fetchKMLData = async () => {
      try {
        const response = await fetch(urlKmlToFetsh);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const kmlContent = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlContent, "text/xml");

        const coordinatesNode = xmlDoc.querySelectorAll("coordinates");

        const extractedCoordinates = [];

        coordinatesNode.forEach((coord) => {
          const coordText = coord.textContent.trim();
          const coordList = coordText.split(" ");
          coordList.forEach((c) => {
            const [lon, lat] = c.split(",");
            extractedCoordinates.push({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
            });
          });
        });
        console.log(kmlFile);
        setKmlCoordiantes(extractedCoordinates);
      } catch (error) {
        console.error("Erreur lors de la récupération du fichier KML", error);
      }
    };
    fetchKMLData();
  }, [kmlFile]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Delete" &&
        selectedMarkerId &&
        selectedMarkerType !== markerTypes.destination &&
        selectedMarkerType !== markerTypes.origin &&
        !isInputFocused
      ) {
        selectedMarkerId &&
          handleMarkerDelete(selectedMarkerId, selectedMarkerToDelete);
        setSelectedMarkerId("");
        setSelectedMarkerToDelete("");
        setSelectedMarkerType("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMarkerId, isInputFocused]);

  /**
   * Permet de récupérer les données du parcours
   */
  async function fetchData() {
    setCustomIndicationsEdited(projectDatas.customIndicationsEdited);
    //récuperer le point de départ et d'arrivée du projet
    if (projectDatas.originPOI) {
      setOriginMarker(projectDatas.originPOI);
      if (projectDatas.destinationPOI)
        setDestinationMarker(projectDatas.destinationPOI);
    }

    //Récupération des POI du projet afin de les afficher sur la carte dès le chargement de la page
    const projectPoisArray = projectDatas.POIs.sort(
      (a, b) => a.dateOfCreation - b.dateOfCreation
    ).map((marker) => {
      let icon =
        marker.type === markerTypes.information
          ? markerIcons[marker.subType]
          : markerIcons[marker.type];
      return {
        _id: marker._id,
        id: new Date(marker.id).getTime(),
        lat: parseFloat(marker.position.lat),
        lng: parseFloat(marker.position.lng),
        title: marker.title,
        type: marker.type,
        distanceToMarker: marker.distanceToMarker,
        subType: marker.subType,
        // l'icone du marker qui apparait sur la carte
        icon: icon,
        stopover: marker.stopover,
        Project_id: marker.Project_id,
        serverId: marker._id,
        description: marker.description,
        image: marker.image,
        // l'icone du PI touristique
        iconImage: marker.iconImage,
        iconName: marker.iconName,
        markerToDownload: marker.markerToDownload,
        video: marker.video,
        audio: marker.audio,
        checkAcces: marker.checkAcces,
        checkAudio: marker.checkAudio,
        imageName: marker.imageName,
        videoName: marker.videoName,
        iconNameWithoutBorder: marker.iconNameWithoutBorder,
        audioName: marker.audioName,
        mainResource: marker.mainResource,
        resourceArray: marker.resourceArray,
        triggerType: marker.triggerType,
        triggerDistance: marker.triggerDistance,
        openQuestionArray: marker.openQuestionArray,
        qcmArray: marker.qcmArray,
        qcmImageArray: marker.qcmImageArray,
        url: marker.url,
        draggable: true,
        onClick: () => {
          handleMarkerClick(marker);
        },
      };
    });
    setMarkers(projectPoisArray);
    if (projectDatas.customNavigationPoints)
      setCustomNavigationPoints(
        JSON.parse(projectDatas.customNavigationPoints)
      );
  }

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      //recuperer la localisation si l'utilisateur le permet
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setZoom(ergonomicZoom);
          },
          function (error) {
            console.log(
              "La géolocalisation est désactivée en raison de l'autorisation refusée."
            );
            setLatitude(DEFAULT_LATITUDE);
            setLongitude(DEFAULT_LONGITUDE);
            setZoom(initialZoom);
          }
        );
      } else {
        console.log(
          "La géolocalisation n'est pas prise en charge par votre navigateur."
        );
        setLatitude(DEFAULT_LATITUDE);
        setLongitude(DEFAULT_LONGITUDE);
        setZoom(initialZoom);
      }

      fetchData();
      isInitialMount.current = false;
      if (projectDatas.polyline_result) {
        setPoly(projectDatas.polyline_result);
      }
    }
    // Sinon si le composant a été déjà monté et que les points ont été chargés
    else {
      calculateRoute();
    }
  }, [
    originMarker,
    destinationMarker,
    travelMode,
    avoidHighways,
    optimizeWaypoints,
    editedSubType,
    kmlFile,
  ]);

  useEffect(() => {
    // Ajoutez un écouteur d'événements de clic sur le document entier
    document.addEventListener("click", handleClickOutsideMap);

    // Retirez l'écouteur d'événements lorsque le composant est démonté
    return () => {
      document.removeEventListener("click", handleClickOutsideMap);
    };
  }, []);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };
  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleSelect = (value) => {
    setPlaceInput(value);
    handleFocus();
  };

  const showNavigationPanel = () => {
    setCustomNavigationPanelVisibility({
      height: "482px",
      width: "100%",
      display: "none",
    });
    setNavigationPanelVisibility({
      height: "482px",
      width: "100%",
      display: "block",
    });
  };

  const showCustomNavigationPanel = () => {
    setNavigationPanelVisibility({
      height: "482px",
      width: "100%",
      display: "none",
    });
    setCustomNavigationPanelVisibility({
      height: "482px",
      width: "100%",
      display: "block",
      overflow: "auto",
    });
  };

  /**
   * Permet d'afficher le menu d'information d'un marker
   * @param {integer} id
   */
  const handleMarkerClick = (id) => {
    setShowQrCode(false);
    const newMarkers = markers.map((marker) => {
      console.log(marker);
      if (marker.id === id) {
        const markerClick = {
          ...marker,
          showButton: true, // Ajouter une propriété pour afficher le bouton de suppression
        };
        setSelectedMarkerId(markerClick.id);
        setSelectedMarkerToDelete(markerClick._id);
        setSelectedMarkerType(markerClick.type);
        return markerClick;
      }
      return marker;
    });
    setMarkers(newMarkers);

    const currentScroll = window.scrollY;
    const threshold = 150; //seuil verticale

    if (currentScroll < threshold) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  /**
   * Permet de supprimer un marker après confirmation de l'utilisateur
   * @param {integer} id
   */
  const handleMarkerDelete = async (id, idToDelete) => {
    console.log(isInputFocused);

    if (isInputFocused) {
      return;
    }
    const confirmDelete = await DialogBoxWithConfirmation({
      title: "Confirmation",
      text: t("deleteStepText"),
      icon: "warning",
      cancelButtonText: t("no"),
      confirmButtonText: t("yes"),
    });

    if (confirmDelete) {
      if (idToDelete) {
        // Si le marker est enregistré, on appelle le back pour le supprimer
        try {
          await axios.delete(`${apiUrl}/poi/${idToDelete}`);
          setMarkers((markers) => markers.filter((marker) => marker.id !== id));
          calculateRoute();
          DialogBox({
            text: t("successDeleteStep"),
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          DialogBox({
            text: t("errorDeleteStep"),
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        setMarkers((markers) => markers.filter((marker) => marker.id !== id));
        calculateRoute();
        DialogBox({
          text: t("successDeleteStep"),
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    }
    setSelectedMarkerId("");
    setSelectedMarkerToDelete("");
  };

  /**
   * Permet de mettre le marker d'origine à la position du marker de destination
   * @param {array} newMarkers
   * @param {array} markers
   * @returns {array} updatedMarkers
   */
  const makeOriginSameAsDestination = (newMarkers, markers) => {
    const updatedMarkers = newMarkers.map((marker) => {
      if (marker.type === markerTypes.origin) {
        const destinationMarker = newMarkers.find(
          (m) => m.type === markerTypes.destination
        );
        const editedMarker = {
          ...marker,
          lat: destinationMarker.lat,
          lng: destinationMarker.lng,
        };
        return editedMarker;
      }
      return marker;
    });

    if (updatedMarkers !== markers) {
      setMarkers(updatedMarkers);
    }

    return updatedMarkers;
  };
  /**
   * Permet de mettre à jour la position d'un marker après un drag
   * @param {integer} id - id du marker
   * @param {event} event - événement de drag
   */
  const handleMarkerDragEnd = (id, event) => {
    let editedMarker;
    const newMarkers = markers.map((marker) => {
      if (marker.id === id) {
        editedMarker = {
          ...marker,
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };

        if (marker.id === originMarker.id) {
          setOriginMarker(editedMarker);
        } else if (marker.id === destinationMarker.id) {
          setDestinationMarker(editedMarker);
          if (destinationSameAsOrigin) setOriginMarker(editedMarker); // (à améliorer) Ligne ajoutée car dans le cas destinationSameAsOrigin on ne peut toucher que la destination
        } else {
          const wptMarker = markers.find((m) => m.id === editedMarker.id);
          if (wptMarker) {
            const index = markers.indexOf(wptMarker);
            markers[index] = editedMarker;
          }
        }

        return editedMarker;
      }

      return marker;
    });

    setMarkers(newMarkers);

    if (destinationSameAsOrigin) {
      const updatedMarkers = makeOriginSameAsDestination(newMarkers, markers);
      setMarkers(updatedMarkers);
    }
  };

  /**
   * Permet l'affichage du menu à l'endroit du clic sur la carte
   * @param {event} event - événement de clic sur la carte
   */
  const handleMapClick = (event) => {
    if (event.pixel) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMenuVisible(true);
      setShowInfoPointMenu(false);
      setMenuPosition({
        x: event.pixel.x,
        y: event.pixel.y,
        lat: lat,
        lng: lng,
      });
      setInfoCustomNavig("");
    }
  };

  /**
   * Permet de choisir le type de marker à créer
   * @param {string} type - type de marker
   */
  const handleMenuItemClick = async (type) => {
    let stopover = true;
    if (type === markerTypes.navigation) stopover = false;
    // creation dun nouveau marker avec tous
    let newMarker = {
      id: Date.now(),
      lat: menuPosition.lat,
      lng: menuPosition.lng,

      distanceToMarker:
        type === markerTypes.information ? DISTANCE_TO_TRIGGER_AUDIO : -1,
      type: type,
      icon: "",
      title:
        type === markerTypes.origin
          ? START_POI
          : type === markerTypes.destination
          ? END_POI
          : type === markerTypes.step
          ? NAVIGATION_POI
          : type === markerTypes.information
          ? INFORMATION_POI
          : type === markerTypes.touristic
          ? TOURISTIC_POI
          : type === markerTypes.structure
          ? "CIRCUIT " + projectDatas.name
          : null,
      checkAudio:
        type === markerTypes.information
          ? true
          : type === markerTypes.touristic
          ? true
          : type === markerTypes.structure
          ? false
          : null,
      description:
        type === markerTypes.structure
          ? "Reprise route. Activer le parcours en cliquant sur l'icône 'panneaux' en bas à gauche."
          : "",
      // création du sybType par défault à améliorer pour une meilleur maintenabilité
      subType: "",
      Project_id: projectDatas._id,
      stopover: stopover,
      onClick: () => {
        handleMarkerClick(newMarker);
      },
    };
    if (type === markerTypes.destination) {
      let newDestinationMarker = {
        ...newMarker,
        title: END_POI,
      };
      setDestinationMarker(newDestinationMarker);
      setMarkers([...markers, newDestinationMarker]);
    }
    if (type === markerTypes.information) {
      let newInformationMarker = {
        ...newMarker,
        title: markerTypes.information,
      };
      setMarkers([...markers, newInformationMarker]);
    }
    if (type === markerTypes.structure) {
      let newStructureMarker = {
        ...newMarker,
        title: "CIRCUIT" + projectDatas.name,
      };
      setMarkers([...markers, newStructureMarker]);
    }
    if (type === markerTypes.touristic) {
      let newTouristicMarker = {
        ...newMarker,
        title: TOURISTIC_POI,
        checkAcces: FREE_ACCESS,
        triggerType: MANUAL_TRIGGER,
        triggerDistance: MINIMAL_RADIUS,
      };
      setMarkers([...markers, newTouristicMarker]);
    } else if (type === markerTypes.origin) {
      const origin = {
        ...newMarker,
        type: markerTypes.origin,
        title: START_POI,
      };
      setOriginMarker(origin);
      const confirm = await DialogBoxWithConfirmation({
        title: "Confirmation",
        text: t("fastForwardQuestion"),
        icon: "question",
        cancelButtonText: t("no"),
        confirmButtonText: t("yes"),
      });
      if (confirm) {
        setDestinationSameAsOrigin(true);
        const destination = {
          ...newMarker,
          id: Date.now(),
          type: markerTypes.destination,
          title: END_POI,
        };
        setDestinationMarker(destination);
        setMarkers([...markers, origin, destination]);
      } else {
        setMarkers([...markers, origin]);
      }
    } else setMarkers([...markers, newMarker]);
  };

  /**
   * Permet de faire le focus sur le lieu recherché
   */
  const handleFocus = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: placeInput }, (results, status) => {
      if (status === "OK") {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setMapPosition({ lat, lng });
        setMenuVisible(true);
        setZoom(ergonomicZoom);
        setInfoCustomNavig("");
      }
    });
  };

  /**
   * Choix du mode d'itinéraire
   * @param {event} e - événement de clic sur le bouton
   */
  const handleTravelMode = (e) => {
    console.log("jest: Fonction de handleTravelmode est appelé");
    setTravelMode(e.target.id);
  };

  /**
   * Permet de calculer l'itinéraire
   *
   */
  const calculateRoute = async () => {
    console.log("jest: Appeller la fonction calculateRoute");
    const directionsService = new window.google.maps.DirectionsService();
    const origin = markers.find((marker) => marker.type === markerTypes.origin);
    const destination = markers.find(
      (marker) => marker.type === markerTypes.destination
    );

    setStepMarkers(
      markers
        .filter(
          (marker) =>
            marker.type === markerTypes.step ||
            marker.type === markerTypes.navigation
        )
        .sort((a, b) => a.dateOfCreation - b.dateOfCreation)
        .map((marker) => {
          return {
            location: new window.google.maps.LatLng(marker.lat, marker.lng),
            stopover: marker.stopover,
          };
        })
    );

    const results = await directionsService.route({
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(
        destination.lat,
        destination.lng
      ),
      waypoints: stepMarkers,
      optimizeWaypoints: optimizeWaypoints,
      travelMode: travelMode,
      avoidHighways: avoidHighways,
      provideRouteAlternatives: true,
    });
    setDirectionsResponse(results);

    // Obtention de la nouvelle polyligne de l'itinéraire
    const newPolyline = results.routes[selectedRoute].overview_polyline;
    setPoly(newPolyline);
    const legs = results.routes[selectedRoute].legs;
    const totalDistance = legs
      .map((leg) => leg.distance.value)
      .reduce((a, b) => a + b);

    const totalDuration = results.routes[selectedRoute].legs
      .map((leg) => leg.duration.value)
      .reduce((a, b) => a + b);

    function formatDuration(duration) {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      const hoursString = hours > 0 ? `${hours}h` : "";
      const minutesString = minutes > 0 ? `${minutes}min` : "";
      const secondsString = seconds > 0 ? `${seconds}s` : "";
      return `${hoursString} ${minutesString} ${secondsString}`.trim();
    }
    // Problème ici car ça calcule uniquement le premier segment (faire une boucle sur tous les legs dans routes[0])
    setDistance("Distance : " + totalDistance / 1000 + " km");
    setDuration(t("duration") + " : " + formatDuration(totalDuration));

    // Affection des points du tracé
    setTrkseg(results.routes[selectedRoute].overview_path);
    // Affection des points de navigation
    let steps = [];
    results.routes[selectedRoute].legs.forEach((leg) => {
      //steps.push(leg.end_address);
      leg.steps.forEach((step) => {
        steps.push(step);
      });
    });

    if (!customIndicationsEdited) setCustomNavigationPoints(steps);

    // on check si customNavigationPoints est null : on fait le set
    if (!customNavigationPoints.length) {
      setCustomNavigationPoints(steps);
    }

    setClassCompilationButton("btn btn-outline-success mt-4");
    setInitialNavigationButtonClass("initialDirections");
    setCustomNavigationButtonClass("customDirections");
    setSendData("btn btn-outline-primary mt-4");
  };
  /**
   * Permet de cache le menu d'information d'un marker en cas de clic en dehors de la carte
   * @param {event} event - événement de clic en dehors de la carte
   */
  const handleClickOutsideMap = (event) => {
    // Vérifiez si l'événement de clic a été déclenché à l'extérieur de l'élément de carte
    if (mapRef.current && !mapRef.current.contains(event.target)) {
      setMenuVisible(false);
      // setShowInfoPointMenu(false);
    }
  };
  /**
   * Supprime le marker du tableau iconIndexArray
   * @param {object} marker - marker concerné
   */
  // Todo : à fusionner avec la fonction dans Hub.js
  const deleteFromIconIndexArray = (marker) => {
    // Par sécurité, on ne supprime pas la valeur par défaut
    if (iconIndexArray.length < 2) return;
    if (marker.type === markerTypes.touristic) {
      // On incrémente l'index uniquement quand le marker à sauvegarder contient une icone
      if (marker.iconName && marker.iconName.length > 0) {
        // On vérifie que l'icone n'existe pas déjà dans la liste du User
        if (iconIndexArray.includes(marker.iconName)) {
          const iconNameIndex = iconIndexArray.indexOf(marker.iconName);
          if (iconNameIndex !== -1) {
            iconIndexArray[iconNameIndex] =
              ICON_INDEX_DELETED + marker.iconName;
          }
        }
      }
    }
  };
  /**
   * Met à jour les  markers du projet
   * @param {string} projectId - id du projet
   * @param {array} currentMarkers - tableau des markers actuels
   */
  const updateProjectMarkers = async (currentMarkers, projectId) => {
    const projectMarkers = await axios.get(
      apiUrl + POI_OF_PROJECT_ROUTE + projectId
    );
    projectMarkers.data.forEach(async (marker) => {
      // vérifier si le marqueur appartient au projet actuel
      if (marker.Project_id === projectId) {
        const markerExists = currentMarkers.find(
          (m) => m.serverId === marker._id
        );
        if (!markerExists) {
          try {
            deleteFromIconIndexArray(marker);
            await axios.delete(apiUrl + POI_ROUTE + marker._id);
          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  };

  /**
   * Permet de sauvegarder les données du projet
   */
  const sendDataToServ = async () => {
    LoadingBox({
      text: t("saveProject"),
      icon: "info",
    });
    // Copie des marqueurs pour éviter les modifications d'état inattendues
    const currentMarkers = [...markers];

    // Envoi des mises à jour et des nouveaux marqueurs
    await Promise.all(
      currentMarkers.map(async (marker) => {
        let markerData = {
          //_id: marker._id,
          id: marker.id,
          position: { lat: marker.lat, lng: marker.lng },
          type: marker.type,
          distanceToMarker: marker.distanceToMarker,
          subType: marker.subType,
          // icone du marker qui apparait sur la carte
          icon: markerIcons[marker.type],
          title: marker.title,
          description: marker.description,
          image: marker.image,
          // icone du marker touristique
          iconImage: marker.iconImage,
          iconName: marker.iconName,
          markerToDownload: marker.markerToDownload,
          video: marker.video,
          audio: marker.audio,
          checkAudio: marker.checkAudio,
          checkAcces: marker.checkAcces,
          imageName: marker.imageName,
          videoName: marker.videoName,
          iconNameWithoutBorder: marker.iconNameWithoutBorder,
          audioName: marker.audioName,
          stopover: marker.stopover,
          Project_id: marker.Project_id,
          mainResource: marker.mainResource,
          resourceArray: marker.resourceArray,
          triggerType: marker.triggerType,
          triggerDistance: marker.triggerDistance,
          openQuestionArray: marker.openQuestionArray,
          qcmArray: marker.qcmArray,
          qcmImageArray: marker.qcmImageArray,
          url: marker.url,
        };

        if (marker.hasOwnProperty("serverId")) {
          // si le marker a déjà été envoyé au serveur et a reçu un id,
          // on vérifie s'il a bougé par rapport à la dernière position enregistrée
          if (
            markerData.position.lat !== marker.lastLat ||
            markerData.position.lng !== marker.lastLng
          ) {
            // si yes, on envoie une requête de mise à jour
            try {
              const res = await axios.put(
                apiUrl + POI_ROUTE + marker.serverId,
                markerData
              );
            } catch (err) {
              console.error(err);
            }
          }
        } else {
          // si le marker n'a jamais été envoyé à la bdd
          try {
            const res = await axios.post(apiUrl + POI_ROUTE, markerData);
            marker.serverId = res.data._id;
          } catch (err) {
            console.error(err);
          }
        }
      })
    );

    updateProjectMarkers(currentMarkers, projectDatas._id);
    // sauvegarde des autres attributs du projet
    try {
      const currentDate = new Date();
      const res = await axios.put(apiUrl + PROJECT_ROUTE + projectDatas._id, {
        originPOI: originMarker,
        destinationPOI: destinationMarker,
        customIndicationsEdited: customIndicationsEdited,
        customNavigationPoints: JSON.stringify(customNavigationPoints),
        polyline_result: poly,
        destinationSameAsOrigin: destinationSameAsOrigin,
        dateOfModification: currentDate,
        kmlFile: kmlFile,
        urlKmlToFetsh: urlKmlToFetsh,
        trkseg: trkseg,
      });
    } catch (error) {
      console.error(error);
    }

    // sauvegarde des attributs du User
    try {
      const res = await axios.put(apiUrl + USER_ROUTE + userData._id, {
        iconIndexArray: iconIndexArray,
      });
    } catch (error) {
      console.error(error);
    }

    closeLoadingBox();
  };

  /**
   * Exporte le parcours
   */

  function exportParcours() {
    const parcours = {
      originPOI: originMarker,
      destinationPOI: destinationMarker,
      customIndicationsEdited: customIndicationsEdited,
      customNavigationPoints: customNavigationPoints,
      markers: markers,
    };

    // Convertir l'objet parcours en chaîne JSON
    const parcoursJSON = JSON.stringify(parcours);

    // Créer un lien de téléchargement pour le fichier JSON
    const downloadLink = document.createElement("a");
    downloadLink.href =
      "data:text/json;charset=utf-8," + encodeURIComponent(parcoursJSON);
    downloadLink.download = "parcours.json";

    // Simuler le clic sur le lien de téléchargement pour démarrer le téléchargement
    downloadLink.click();
  }

  /**
   * Permet de lancer la compilation du projet (dl ou transfert), utilisation la fonction/fichier CompileProject
   * @param {boolean} sendToDevice - boolléen permettant d'identifier un dl local d'un transfert vers la tablette
   */

  const handleCompile = (sendToDevice, sendToServer) => {
    // Recherche du marker de type 'touristic' non vide
    const hasEmptyTouristicMarker = markers.some(
      (marker) => marker.type === markerTypes.touristic && !marker.iconImage
    );

    if (!hasEmptyTouristicMarker) {
      CompileProject(
        projectDatas.name,
        customNavigationPoints,
        markers,
        markerTypes,
        originMarker,
        destinationMarker,
        destinationSameAsOrigin,
        trkseg,
        projectDatas.projectType,
        // todo : à enlever après vérification (les 2 lignes ci-dessous)
        //iconIndexArray, setIconIndexArray,
        iconIndexArray,
        KmlCoordinates,
        sendToDevice,
        sendToServer
      );
      setTimeout(() => {
        closeLoadingBox();
      }, 35000);
    } else {
      DialogBox({
        text: t("addIcon"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  /**
   * Permet de lancer l'exportation du projet, utilisation de la fonction/fichier ExportProject
   */
  const handleExport = (uploadToGithub) => {
    if (userPack === "Standard") {
      DialogBoxWithFooter({
        title: t("premiumFeatures"),
        text: t("exportPremium"),
        icon: "warning",
        confirmButtonText: "OK",
        footer: t("toBePremium"),
        footerOnClick: () => setVisibleComponent("Subscriptions"),
      });
      return;
    }
    ExportProject(
      projectDatas.name,
      markers,
      markerTypes,
      originMarker,
      destinationMarker,
      destinationSameAsOrigin,
      trkseg,
      projectDatas.projectType,
      uploadToGithub,
      customNavigationPoints
    );
  };

  /**
   * Permet d'envoyer le fichier GPX au serveur, utilisant la fonction/fichier SendGpx
   */

  const handleSendGpxToServ = () => {
    SendGpx(
      projectDatas.name,
      customNavigationPoints,
      markers,
      markerTypes,
      trkseg,
      projectDatas.projectType
    );
  };

  /**
   * Permet de changer la route sélectionnée
   * @param {object} directions
   */

  const handleRouteChange = (directions) => {
    // Récupérer l'index de l'itinéraire sélectionné dans l'objet DirectionsResult
    const newSelectedRouteIndex = directions.routes.findIndex(
      (route) => route === directions.routes[selectedRoute]
    );
    setSelectedRoute(newSelectedRouteIndex);
  };
  //ferme infoWindow
  const fermerInfoWindow = () => {
    setInfoCustomNavig("");
  };
  // recharger la map une fois que la position change
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const center = new window.google.maps.LatLng(
        parseFloat(mapPosition.lat),
        parseFloat(mapPosition.lng)
      );
      setZoom(13);
    }
  }, [mapPosition]);

  useEffect(() => {
    const relevantMarkers = markers.filter(
      (marker) =>
        marker.type === markerTypes.origin ||
        marker.type === markerTypes.destination ||
        marker.type === markerTypes.step
    );

    if (relevantMarkers.length === 0) return;

    const timeoutId = setTimeout(() => {
      calculateRoute();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    // On surveille uniquement les markers pertinents, donc on filtre ici directement
    JSON.stringify(
      markers.filter(
        (marker) =>
          marker.type === markerTypes.origin ||
          marker.type === markerTypes.destination ||
          marker.type === markerTypes.step
      )
    ),
    JSON.stringify(stepMarkers),
  ]);

  /**
   * Check si le téléchargement est possible
   * @returns {boolean} true si le téléchargement est possible, false sinon
   */
  const checkPossibleUpload = () => {
    if (downloadTime) {
      const currentTime = new Date();
      const timeDifference = currentTime - downloadTime;
      if (timeDifference < 5 * 60 * 1000) {
        LoadingBox({
          text: t("checkPossibleUpload"),
          icon: "warning",
        });
        setTimeout(() => {
          closeLoadingBox();
        }, 4000);
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  /**
   * Permet d'importer un fichier KML
   * @param {event} event - événement de clic sur le bouton d'importation de fichier KML
   */

  const handleKmlUpload = async (event) => {
    const newSelectedFile = event.target.files[0];

    if (checkPossibleUpload() && newSelectedFile) {
      const formData = new FormData();
      formData.append("file", newSelectedFile);
      formData.append("userEmail", userData.email);
      formData.append("userName", userData.name);
      formData.append("projectTitle", projectDatas.name);
      formData.append("GITHUB_REPO", GITHUB_REPO);

      try {
        await axios.post(apiUrl + UPLOAD_FILE_TO_GITHUB, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-filename": KML_File_EXTENSION,
          },
        });
        setDownloadTime(new Date());
        const timestamp = performance.now();
        const fileUrl =
          GITHUB_URL +
          userData.email +
          KML_File_EXTENSION +
          "?timestamp=" +
          timestamp;

        const fileUrlToFetsh = KML_URL + userData.email + KML_File_EXTENSION;

        setKmlFile(fileUrl);
        setUrlKmlToFetsh(fileUrlToFetsh);
        setKmlLayerKey((prevKey) => prevKey + 1);
        setCustomNavigationButtonClass("btn btn-outline-danger mt-4");
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors du téléchargement du fichier KML:",
          error
        );
        console.log(
          "Une erreur s'est produite lors du téléchargement du fichier KML."
        );
      }
    }
  };

  /**
   * Permet d'importer un fichier GPX qui sera converti automatiquement en KML
   * @param {event} event - événement de clic sur le bouton d'importation de fichier GPX
   */

  const handleGpxUpload = async (event) => {
    const newSelectedFile = event.target.files[0];

    if (checkPossibleUpload() && newSelectedFile) {
      // Charger le fichier GPX localement
      const reader = new FileReader();
      reader.onload = async (event) => {
        const gpxContent = event.target.result;

        // Convertir le contenu GPX en KML
        const kmlContent = convertGpxToKml(gpxContent);
        console.log(kmlContent);
        if (kmlContent) {
          // Enregistrez le fichier KML localement
          const kmlBlob = new Blob([kmlContent], { type: "application/xml" });
          const kmlFileName = "converted_file.kml";

          // Envoyer le fichier KML vers votre API backend
          const formData = new FormData();
          formData.append("file", kmlBlob, kmlFileName);
          formData.append("userEmail", userData.email);
          formData.append("userName", userData.name);
          formData.append("projectTitle", projectDatas.name);
          formData.append("GITHUB_REPO", GITHUB_REPO);

          try {
            await axios.post(apiUrl + UPLOAD_FILE_TO_GITHUB, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-filename": GPX_TO_KML_FILE_EXTENSION,
              },
            });
            setDownloadTime(new Date());
            const timestamp = performance.now();
            const fileUrl =
              GITHUB_URL +
              userData.email +
              GPX_TO_KML_FILE_EXTENSION +
              "?timestamp=" +
              timestamp;

            const fileUrlToFetsh =
              KML_URL + userData.email + GPX_TO_KML_FILE_EXTENSION;

            setKmlFile(fileUrl);
            setUrlKmlToFetsh(fileUrlToFetsh);
            setKmlLayerKey((prevKey) => prevKey + 1);
            setCustomNavigationButtonClass("btn btn-outline-danger mt-4");
          } catch (error) {
            console.error(
              "Une erreur s'est produite lors du téléchargement du fichier KML:",
              error
            );
            console.log(
              "Une erreur s'est produite lors du téléchargement du fichier KML."
            );
          }
        } else {
          console.error("La conversion GPX vers KML a échoué.");
        }
      };

      reader.readAsText(newSelectedFile);
    }
  };

  /**
   * Permet d'importer un projet (format GPX) et de l'afficher sur la carte
   * @param {event} e - événement de clic sur le bouton d'importation de projet
   */

  const handleProjectUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const gpxContent = e.target.result;
        if (
          Object.keys(originMarker).length === 0 ||
          Object.keys(destinationMarker).length === 0
        ) {
          console.log("1");
          LoadingBox({
            text: t("loadingAdd"),
            icon: "info",
          });
          await calculateGPXRoute(
            gpxContent,
            projectDatas,
            markerTypes,
            setOriginMarker,
            setDestinationMarker,
            setMarkers,
            calculateRoute,
            markers
          );
          setShowInputGPX(false);
          closeLoadingBox();
        } else {
          console.log(originMarker + "ok" + destinationMarker);
          DialogBox({
            text: t("importErrorStartEnd"),
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // const premiumUser = userData.pack === "Premium" ? true : false;

  return (
    //passer les informations en utilisant le useContexte
    <UserContext.Provider
      value={{
        markers,
        setMarkers,
        selectedMarkerId,
        handleMarkerClick,
        handleMarkerDelete,
        customIndicationsEdited,
        setCustomIndicationsEdited,
        customNavigationPoints,
        setCustomNavigationPoints,
        setMapPosition,
        infoCustomNavig,
        setInfoCustomNavig,
        travelMode,
        setTravelMode,
        handleMenuItemClick,
        markerTypes,
        iconIndexArray,
        setIconIndexArray,
        userData,
      }}
    >
      <MapBoxSize zoom={zoom} setMapDimensions={setMapDimensions} />

      <div>
        <CoordinatesAlert copiedCoordinates={copiedCoordinates} />
        <div className="container-fluid">
          <div className="row">
            <div
              className={
                customNavigationPanelVisibilityIsActif ||
                navigationPanelVisibilityIsActif
                  ? "col-md-4"
                  : "col-md-6"
              }
            >
              <MapWithAMarker
                containerElement={
                  <div
                    className="carte"
                    style={{
                      height: mapDimensions.height,
                      width: mapDimensions.width,
                    }}
                    ref={mapRef}
                  />
                }
                mapElement={<div style={{ height: "100%" }} />}
                markers={markers}
                onMarkerDragEnd={handleMarkerDragEnd}
                onMarkerClick={handleMarkerClick}
                onMarkerClickDelete={handleMarkerDelete}
                onMapClick={handleMapClick}
                position={
                  mapPosition !== initialPosition
                    ? mapPosition
                    : { lat: latitude, lng: longitude }
                }
                zoom={markers.length ? zoom : zoom}
                directionsResponse={directionsResponse}
                path={path}
                selectedRoute={selectedRoute}
                handleRouteChange={handleRouteChange}
                poiLabels={poiLabels}
                infoCustomNavig={infoCustomNavig}
                fermerInfoWindow={fermerInfoWindow}
                mapPosition={mapPosition}
                markerIcons={markerIcons}
                selectedMarkerId={selectedMarkerId}
                kmlFile={kmlFile}
                kmlLayerKey={kmlLayerKey}
              />
            </div>

            <div
              className={
                customNavigationPanelVisibilityIsActif ||
                navigationPanelVisibilityIsActif
                  ? "row col-md-8 mb-4 mx-auto mx-md-auto py-3 py-md-0"
                  : "row col-md-6 mb-4 mx-auto mx-md-auto py-3 py-md-0"
              }
              style={{ maxheight: "500px" }}
            >
              <PlacesAutocomplete
                value={placeInput ? placeInput : ""}
                onChange={(value) => setPlaceInput(value)}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <>
                    <div
                      className={
                        customNavigationPanelVisibilityIsActif ||
                        navigationPanelVisibilityIsActif
                          ? "containerCalculateRoute  col-md-6 "
                          : "containerCalculateRoute  col-md-12"
                      }
                    >
                      {/*getInputProps est une fonction qui prend en compte ce qu'on ecrit dans l'input de recherche d'adresse*/}
                      <div className="searchBarContainer">
                        <img
                          src={LOGO_CONNEXION_IMG}
                          alt="logo"
                          className="logoSearchBar"
                        />
                        <div className="searchBar">
                          <input
                            className="inputFindRoute"
                            {...getInputProps({
                              placeholder: t("searchAddress"),
                            })}
                          />
                          <button
                            className="buttonFindRoute"
                            onClick={handleFocus}
                          >
                            <i className="iconSearchRoute bi bi-search"></i>
                          </button>
                        </div>
                      </div>
                      {/*parmètrage des suggestions de lieux*/}
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const style = suggestion.active
                          ? { backgroundColor: "#fafafa", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          //la fonction getSuggestionItemProps prend en compte les suggestions de lieux qui seront affichés dans un span
                          <div
                            {...getSuggestionItemProps(suggestion, { style })}
                            key={suggestion.placeId}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                      <CalculateRouteButtons
                        selectedButtonStyle={selectedButtonStyle}
                        notSelectedButtonStyle={notSelectedButtonStyle}
                        travelMode={travelMode}
                        handleTravelMode={handleTravelMode}
                        calculateRoute={calculateRoute}
                        setTravelMode={setTravelMode}
                      />
                      <MapBoxOptions
                        distance={distance}
                        duration={duration}
                        showAllLabels={showAllLabels}
                        hideAllLabels={hideAllLabels}
                        optimizeWaypoints={optimizeWaypoints}
                        setOptimizeWaypoints={setOptimizeWaypoints}
                        avoidHighways={avoidHighways}
                        setAvoidHighways={setAvoidHighways}
                        setPoilLabels={setPoilLabels}
                      />
                      <MapBoxFeatures
                        refreshMap={refreshMap}
                        initialButtonNavigationsVisibility={
                          initialButtonNavigationsVisibility
                        }
                        customNavigationButtonClass={
                          customNavigationButtonClass
                        }
                        handleCompile={handleCompile}
                        handleExport={handleExport}
                        handleSendGpxToServ={handleSendGpxToServ}
                        showNavigationPanel={showNavigationPanel}
                        showCustomNavigationPanel={showCustomNavigationPanel}
                        toggleCustomNavigationPanel={
                          toggleCustomNavigationPanel
                        }
                        toggleNavigationPanel={toggleNavigationPanel}
                        sendDataToServ={sendDataToServ}
                        markers={markers}
                        exportParcours={exportParcours}
                        handleKmlUpload={handleKmlUpload}
                        showInputKML={showInputKML}
                        setShowInputKML={setShowInputKML}
                        showInputGPX={showInputGPX}
                        setShowInputGPX={setShowInputGPX}
                        showInputGPXKml={showInputGPXKml}
                        setShowInputGPXKml={setShowInputGPXKml}
                        handleProjectUpload={handleProjectUpload}
                        handleGpxUpload={handleGpxUpload}
                        userPack={userPack}
                        setShowQrCode={setShowQrCode}
                        setSelectedMarkerId={setSelectedMarkerId}
                        setSelectedMarkerToDelete={setSelectedMarkerToDelete}
                        setVisibleComponent={setVisibleComponent}
                        projectDatas={projectDatas}
                      />
                    </div>
                    <div className=" col-md-6  mx-auto mx-md-auto py-3 py-md-0">
                      {customNavigationPanelVisibility.display === "block" &&
                        customNavigationPanelVisibilityIsActif && (
                          <div className="headerDirections">
                            <span className="spanTitleDirections col-12">
                              <h6 className="titleDirections">
                                {t("customDirections")}
                              </h6>
                            </span>
                          </div>
                        )}
                      {navigationPanelVisibility.display === "block" &&
                        navigationPanelVisibilityIsActif && (
                          <div className="headerDirections">
                            <span className="spanTitleDirections  col-12">
                              <h6 className="titleDirections">
                                {t("initialDirections")}
                              </h6>
                            </span>
                          </div>
                        )}

                      <div
                        id="directions-panel"
                        className="directionsContainer overflow-auto"
                        style={{
                          height: "482px",
                          width: "100%",
                          display: navigationPanelVisibilityIsActif
                            ? "block"
                            : "none",
                        }}
                      ></div>

                      <div
                        id="custom-directions-panel"
                        className="directionsContainer overflow-auto"
                        style={customNavigationPanelVisibility}
                      >
                        {customNavigationPanelVisibility.display === "block" &&
                          customNavigationPanelVisibilityIsActif && (
                            <CustomNavigation
                              directionsResponse={directionsResponse}
                              selectedRoute={selectedRoute}
                              kmlFile={kmlFile}
                              customIndicationsEdited={customIndicationsEdited}
                              setCustomIndicationsEdited={
                                setCustomIndicationsEdited
                              }
                              customNavigationPoints={customNavigationPoints}
                              setCustomNavigationPoints={
                                setCustomNavigationPoints
                              }
                              setMapPosition={setMapPosition}
                              setInfoCustomNavig={setInfoCustomNavig}
                            />
                          )}
                      </div>
                    </div>
                  </>
                )}
              </PlacesAutocomplete>
            </div>
          </div>
          <div className="row flex-column flex-md-row customRow">
            <div className="containerCalculateRoute h-100 col-12 col-md-4 customStepbox">
              <StepBox
                markers={markers}
                handleMarkerClick={handleMarkerClick}
                titleOfProject={titleOfProject}
                selectedMarkerId={selectedMarkerId}
                stepMarkers={stepMarkers}
                originMarker={originMarker}
                destinationMarker={destinationMarker}
              />
            </div>
            <div
              className={`col-${
                customNavigationPanelVisibilityIsActif ||
                navigationPanelVisibilityIsActif
                  ? "2 ms-5"
                  : "3"
              }`}
            ></div>

            <div
              className={`col-12 col-md-${
                customNavigationPanelVisibilityIsActif ||
                navigationPanelVisibilityIsActif
                  ? "3 ms-5"
                  : "4"
              } center-content`}
            >
              <Indice
                projectDatas={projectDatas}
                setEditedSubType={setEditedSubType}
                setMarkers={setMarkers}
                showQrCode={showQrCode}
                handleInputBlur={handleInputBlur}
                handleInputFocus={handleInputFocus}
                userData={userData}
              />
            </div>
          </div>
        </div>
        <ContextMenu
          menuVisible={menuVisible}
          projectDatas={projectDatas}
          markerTypes={markerTypes}
          originMarker={originMarker}
          destinationMarker={destinationMarker}
          menuPosition={menuPosition}
          handleMenuItemClick={handleMenuItemClick}
          handleClickOutsideMap={handleClickOutsideMap}
          setCopiedCoordinates={setCopiedCoordinates}
          setShowInfoPointMenu={setShowInfoPointMenu}
        />
        <InfoPointMenu
          markerTypes={markerTypes}
          originMarker={originMarker}
          menuPosition={menuPosition}
          handleMenuItemClick={handleMenuItemClick}
          setShowInfoPointMenu={setShowInfoPointMenu}
          showInfoPointMenu={showInfoPointMenu}
          projectType={projectDatas.projectType}
        />
      </div>
    </UserContext.Provider>
  );
}
