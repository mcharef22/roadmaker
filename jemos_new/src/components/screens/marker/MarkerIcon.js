import React from "react";
import cadreVoiture from "./cadre/cadreVoiture.png";
import cadreVelo from "./cadre/cadreVelo.png";
import cadrePedestre from "./cadre/cadrePedestre.png";
import cadreVoitureAudio from "./cadre/cadreVoitureAudio.png";
import cadreVeloAudio from "./cadre/cadreVeloAudio.png";
import cadrePedestreAudio from "./cadre/cadrePedestreAudio.png";
import cadreVoiturePartielPayant from "./cadre/cadreVoiturePartielPayant.png";
import cadreAVoiturePartielPayant from "./cadre/cadreAVoiturePatielPayant.png";
import cadreAVeloPartielPayant from "./cadre/cadreAVeloPartielPayant.png";
import cadreVeloPartielPayant from "./cadre/cadreVeloPartielPayant.png";
import cadrePayant from "./cadre/cadrePayant.png";
import cadreAudioPayant from "./cadre/cadreAudioPayant.png";
import cadreAPedestrePartielPayant from "./cadre/cadreAPedestrePartielPayant.png";
import cadrePedestrePartielPayant from "./cadre/cadrePedestrePartielPayant.png";
import "../../style/Marker.css";
import { parcoursTypes } from "../../map/gpx/Resources";

const MarkerIcon = ({
  componentType,
  projectDatas,
  markerAccesValue,
  markerCheckAudio,
  iconNameWithoutBorder,
  marker,
}) => {
  const url_icon = `https://raw.githubusercontent.com/mcharef22/icons/main/${
    marker.id
  }${
    iconNameWithoutBorder ? iconNameWithoutBorder : marker.iconNameWithoutBorder
  }`;
  const FREE_ACCESS = "Gratuit";
  const PARTIALLY_PAID_ACCESS = "Partiellement payant";
  const PAID_ACCESS = "Payant";
  return (
    <>
      <div id="marker-icon" className="markerIconWithBorder">
        <img
          src={
            componentType === "Information"
              ? projectDatas.projectType === parcoursTypes.car
                ? marker.checkAcces === FREE_ACCESS && !marker.checkAudio
                  ? cadreVoiture
                  : marker.checkAcces === FREE_ACCESS && marker.checkAudio
                  ? cadreVoitureAudio
                  : marker.checkAcces === PARTIALLY_PAID_ACCESS &&
                    !marker.checkAudio
                  ? cadreVoiturePartielPayant
                  : marker.checkAcces === PARTIALLY_PAID_ACCESS &&
                    marker.checkAudio
                  ? cadreAVoiturePartielPayant
                  : marker.checkAcces === PAID_ACCESS && !marker.checkAudio
                  ? cadrePayant
                  : marker.checkAcces === PAID_ACCESS && marker.checkAudio
                  ? cadreAudioPayant
                  : cadreVoitureAudio
                : projectDatas.projectType === parcoursTypes.cycle
                ? marker.checkAcces === FREE_ACCESS && !marker.checkAudio
                  ? cadreVelo
                  : marker.checkAcces === FREE_ACCESS && marker.checkAudio
                  ? cadreVeloAudio
                  : marker.checkAcces === PARTIALLY_PAID_ACCESS &&
                    !marker.checkAudio
                  ? cadreVeloPartielPayant
                  : marker.checkAcces === PARTIALLY_PAID_ACCESS &&
                    marker.checkAudio
                  ? cadreAVeloPartielPayant
                  : marker.checkAcces === PAID_ACCESS && !marker.checkAudio
                  ? cadrePayant
                  : marker.checkAcces === PAID_ACCESS && marker.checkAudio
                  ? cadreAudioPayant
                  : cadreVeloAudio
                : projectDatas.projectType === parcoursTypes.pedestrian
                ? marker.checkAcces === FREE_ACCESS && !marker.checkAudio
                  ? cadrePedestre
                  : marker.checkAcces === FREE_ACCESS && marker.checkAudio
                  ? cadrePedestreAudio
                  : marker.checkAcces === PARTIALLY_PAID_ACCESS &&
                    !marker.checkAudio
                  ? cadrePedestrePartielPayant
                  : marker.checkAcces === PARTIALLY_PAID_ACCESS &&
                    marker.checkAudio
                  ? cadreAPedestrePartielPayant
                  : marker.checkAcces === PAID_ACCESS && !marker.checkAudio
                  ? cadrePayant
                  : marker.checkAcces === PAID_ACCESS && marker.checkAudio
                  ? cadreAudioPayant
                  : cadrePedestreAudio
                : null
              : projectDatas.projectType === parcoursTypes.car
              ? markerAccesValue === FREE_ACCESS && !markerCheckAudio
                ? cadreVoiture
                : markerAccesValue === FREE_ACCESS && markerCheckAudio
                ? cadreVoitureAudio
                : markerAccesValue === PARTIALLY_PAID_ACCESS &&
                  !markerCheckAudio
                ? cadreVoiturePartielPayant
                : markerAccesValue === PARTIALLY_PAID_ACCESS && markerCheckAudio
                ? cadreAVoiturePartielPayant
                : markerAccesValue === PAID_ACCESS && !markerCheckAudio
                ? cadrePayant
                : markerAccesValue === PAID_ACCESS && markerCheckAudio
                ? cadreAudioPayant
                : cadreVoitureAudio
              : projectDatas.projectType === parcoursTypes.cycle
              ? markerAccesValue === FREE_ACCESS && !markerCheckAudio
                ? cadreVelo
                : markerAccesValue === FREE_ACCESS && markerCheckAudio
                ? cadreVeloAudio
                : markerAccesValue === PARTIALLY_PAID_ACCESS &&
                  !markerCheckAudio
                ? cadreVeloPartielPayant
                : markerAccesValue === PARTIALLY_PAID_ACCESS && markerCheckAudio
                ? cadreAVeloPartielPayant
                : markerAccesValue === PAID_ACCESS && !markerCheckAudio
                ? cadrePayant
                : markerAccesValue === PAID_ACCESS && markerCheckAudio
                ? cadreAudioPayant
                : cadreVeloAudio
              : projectDatas.projectType === parcoursTypes.pedestrian
              ? markerAccesValue === FREE_ACCESS && !markerCheckAudio
                ? cadrePedestre
                : markerAccesValue === FREE_ACCESS && markerCheckAudio
                ? cadrePedestreAudio
                : markerAccesValue === PARTIALLY_PAID_ACCESS &&
                  !markerCheckAudio
                ? cadrePedestrePartielPayant
                : markerAccesValue === PARTIALLY_PAID_ACCESS && markerCheckAudio
                ? cadreAPedestrePartielPayant
                : markerAccesValue === PAID_ACCESS && !markerCheckAudio
                ? cadrePayant
                : markerAccesValue === PAID_ACCESS && markerCheckAudio
                ? cadreAudioPayant
                : cadrePedestreAudio
              : null
          }
          alt="Image de cadre"
          className="cadreIcon"
        />

        <img src={url_icon} alt="Image téléchargée" className="iconMarker" />
      </div>
    </>
  );
};
export default MarkerIcon;
