import { strcuturePoiIcon, strcuturePoiTagContent } from "../../gpx/Resources";
import sendGpxToServ from "./SendGpxToServ";
// import * as adb from 'adbkit';
export const translateManeuver = (maneuver, instructions) => {
  const getRoundaboutExitText = (string) => {
    const match = string.match(/\d+/);
    if (match) {
      const exitNumber = parseInt(match[0]);
      if (!isNaN(exitNumber) && exitNumber >= 1 && exitNumber <= 5) {
        if (exitNumber === 1) {
          return "1ère Sortie";
        } else {
          return exitNumber + "ème Sortie";
        }
      }
    }
    return "";
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
  };
  return translations[maneuver]
    ? typeof translations[maneuver] === "function"
      ? translations[maneuver]()
      : translations[maneuver]
    : maneuver;
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

const trkType = (parcoursType) => {
  const typeColors = {
    Voiture: "#0000FF",
    Rando: "#00AE00",
    Retour_rapide: "#D152D7",
    Velo: "FF5733",
  };
  return typeColors[parcoursType] || null;
};

const iconNumber = (type) => {
  const iconNumbers = {
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

export const SendGpx = (
  projectName,
  customNavigationPoints,
  markers,
  markerTypes,
  trkseg,
  parcoursType
) => {
  const initialGPX =
    `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" creator="EcoMobile
Loisirs" version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.topografix.com/GPX/1/1
http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata>
<name><![CDATA[CIRCUIT ` +
    projectName +
    `]]></name>
<link href="https://www.ecomobileloisirs.fr">
<text>EcoMobile Loisirs</text>
</link>
</metadata>

<!--Points de Navigation-->
` +
    customNavigationPoints.map((step) => {
      let location;
      if (typeof step.start_location == "string") {
        //console.log(step.start_location);
        location = step.start_location;
      } else location = step.start_location.toUrlValue(6);
      const lat = location.substring(0, 9);
      const lng = location.substring(10, location.length);
      const type = translateManeuver(step.maneuver, step.instructions);
      if (type)
        return (
          `<wpt lat="` +
          lat +
          `" lon="` +
          lng +
          `">
<ele>NaN</ele>
<time> NaN </time>
<name><![CDATA[]]></name>      
<description>` +
          step.instructions +
          `</description>
<sym>Waypoint</sym>
<type>` +
          type +
          `</type>
<extensions>
<om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
<om:ext type="ICON" subtype="0">` +
          iconNumber(type) +
          `</om:ext>
<om:ext type="DISTANCE">` +
          step.distance.value +
          `</om:ext>
</om:oruxmapsextensions>
</extensions>
</wpt>\n`
        );
    }) +
    `

<!--Points d'intérêts Standard-->
` +
    markers.map((marker, index) => {
      let i = 0;
      if (marker.type.includes("info")) {
        console.log(marker);
        i++;
        return (
          `<wpt lat="` +
          marker.lat +
          `" lon="` +
          marker.lng +
          `">
  <ele>NaN</ele>
  <time> NaN </time>
  <name><![CDATA[Point Info]]></name>      
  <sym>Waypoint</sym>
  <type>` +
          marker.subType +
          `</type>
  <extensions>
  <om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
  <om:ext type="ICON" subtype="0">` +
          subTypeNumber(marker.subType) +
          `</om:ext>
  <om:ext type="DISTANCE">` +
          marker.distanceToMarker +
          `</om:ext>
  </om:oruxmapsextensions>
  </extensions>
  </wpt>\n`
        );
      }
    }) +
    `

<!--Points d'intérêts touristiques-->
` +
    markers.map((marker) => {
      if (marker.type === markerTypes.touristic) {
        return (
          `<wpt lat="` +
          marker.lat +
          `" lon="` +
          marker.lng +
          `">
<ele>NaN</ele>
<time> NaN </time>
<name><![CDATA[]]></name>
<desc><![CDATA[` +
          marker.textsPresentation +
          `]]></desc>
<sym>Waypoint</sym>
<type></type>
<extensions>
<om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
<om:ext type="ICON" subtype="0">10061</om:ext>
<om:ext type="DISTANCE">200</om:ext>
</om:oruxmapsextensions>
</extensions>
</wpt>\n`
        );
      }
    }) +
    `
<!--Points d'interêt de structure-->
    ` +
    markers.map((marker) => {
      if (
        marker.type === markerTypes.origin ||
        marker.type === markerTypes.destination ||
        marker.type === markerTypes.structure
      ) {
        return (
          `<wpt lat="` +
          marker.lat +
          `" lon="` +
          marker.lng +
          `">
<ele>NaN</ele>
<time> NaN </time>
<name><![CDATA[CIRCUIT ` +
          projectName +
          `]]></name>
<desc><![CDATA[` +
          strcuturePoiTagContent[parcoursType] +
          `]]></desc>
<sym>Waypoint</sym>
<type>` +
          parcoursType +
          `</type>
<extensions>
<om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
<om:ext type="ICON" subtype="0">` +
          strcuturePoiIcon[parcoursType] +
          `</om:ext>
<om:ext type="DISTANCE">-1</om:ext>
</om:oruxmapsextensions>
</extensions>
</wpt>\n`
        );
      }
    }) +
    `

<!--Trace-->
<trk>
<name><![CDATA[CIRCUIT ` +
    projectName +
    `]]></name>
<desc><![CDATA[]]></desc>
<type>Indéfini</type>
<extensions>
<om:oruxmapsextensions xmlns:om="http://www.oruxmaps.com/oruxmapsextensions/1/0">
<om:ext type="TYPE" subtype="0">0</om:ext>
<om:ext type="DIFFICULTY">0</om:ext>
<om:ext type="COLOR">` +
    trkType(parcoursType) +
    `</om:ext>
</om:oruxmapsextensions>
</extensions>
<trkseg>
<!-- Liste de points du circuit -->
` +
    trkseg.map((location) => {
      return (
        `<trkpt lat="` +
        location.lat() +
        `" lon="` +
        location.lng() +
        `"></trkpt>\n\t`
      );
    }) +
    `
  </trkseg>
  </trk>
  </gpx>`;
  const formatedGPX = initialGPX.replaceAll(",", "");
  const blob = new Blob([formatedGPX], { type: "text/plain" });
  sendGpxToServ({ blob });
};
