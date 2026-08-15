import React from "react";
import MarkerIcon from "./MarkerIcon";
import { DISTANCE_TO_TRIGGER_AUDIO } from "../../map/gpx/Resources";
import QRCode from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { printQrCodeHTML } from "../../util/PrintQrCodeHTML";

const ConfigTouristicMarker = ({ marker, projectDatas }) => {
  const qrCodeRef = useRef(null);
  const { t } = useTranslation();

  const LOGO_CONNEXION_IMG = "/rm_imgs/logo_connexion.png";

  const handlePrintQRCode = () => {
    const qrCodeElement = qrCodeRef.current;
    if (qrCodeElement) {
      const canvas = qrCodeElement.querySelector("canvas");
      if (canvas) {
        const imgData = canvas.toDataURL();
        const logo = LOGO_CONNEXION_IMG;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
          const content = printQrCodeHTML(logo, imgData);
          printWindow.document.write(content);
          printWindow.document.close();
          printWindow.onload = function () {
            printWindow.print();
          };
        } else {
          console.error(
            "Failed to open print window. Check if pop-ups are blocked."
          );
        }
      } else {
        console.error("No canvas found in QRCode element");
      }
    }
  };
  return (
    <>
      <div className="d-flex ms-4 mt-1 text-start">
        <h6 className="ms-4">
          {t("distance")} :{" "}
          {marker.distanceToMarker
            ? marker.distanceToMarker
            : DISTANCE_TO_TRIGGER_AUDIO}
        </h6>
      </div>
      <div className="form-check form-switch d-flex justify-content-start align-items-center mt-1 ms-2 ">
        <h6 className="form-check-label ">{t("audio")}</h6>
        <input
          disabled // On désactive le cochage dans sur cet écran
          className="form-check-input ms-3 mb-2"
          type="checkbox"
          checked={marker.checkAudio}
        />
      </div>

      {marker.iconImage && (
        <div className="m-4">
          <p>{t("icon")}</p>
          <MarkerIcon
            projectDatas={projectDatas}
            marker={marker}
            componentType="Information"
          />
          <br />
        </div>
      )}
      {marker.triggerType === "QR Code" && (
        <div>
          <div className="m-4" ref={qrCodeRef}>
            <QRCode value={`${marker.id}`} />
            <br />
            <button className="buttonsFeatures" onClick={handlePrintQRCode}>
              {t("printQrCode")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default ConfigTouristicMarker;
