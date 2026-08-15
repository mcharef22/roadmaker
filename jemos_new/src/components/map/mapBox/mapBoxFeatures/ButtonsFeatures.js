import React, { useState, useRef } from "react";
import DialogBoxWithFooter from "../../../util/DialogBoxWithFooter";
import "../../../style/global.css";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react"; // Import QR code generator
import { apiUrl } from "../../../../config";
import { normalizeFileName } from "../../../util/Util";

const ButtonsFeatures = ({
  sendDataToServ,
  handleCompile,
  userPack,
  handleExport,
  setShowInputGPX,
  setShowInputKML,
  showInputGPX,
  showInputKML,
  handleKmlUpload,
  handleProjectUpload,
  handleGpxUpload,
  setShowInputGPXKml,
  showInputGPXKml,
  setShowQrCode,
  setSelectedMarkerId,
  setSelectedMarkerToDelete,
  setVisibleComponent,
  projectDatas,
}) => {
  const { t } = useTranslation();
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef(null);

  // Fonctions utilitaires pour afficher l'icône premium
  const renderPremiumIcon = () =>
    userPack === "Standard" && (
      <span className="text-warning">
        <i className="bi bi-stars"></i>
      </span>
    );

  const handlePremiumDialog = (feature) => {
    DialogBoxWithFooter({
      title: t("premiumFeatures"),
      text: t(feature),
      icon: "warning",
      confirmButtonText: "OK",
      footer: t("toBePremium"),
      footerOnClick: () => setVisibleComponent("Subscriptions"),
    });
  };

  const handleQrCodeExport = () => {
    setQrCodeVisible(true);
    setQrCodeUrl(
      apiUrl + "/uploads/" + normalizeFileName(projectDatas.name) + ".gpx"
    );
    setTimeout(() => {
      if (qrCodeRef.current) {
        qrCodeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest", 
          inline: "start",
        });
      }
    }, 50);
  };

  return (
    <div className="">
      <div className="d-flex justify-content-around mt-2">
        <button
          className="buttonsFeatures"
          onClick={sendDataToServ}
          aria-label="Sauvegarder"
        >
          <i className="bi bi-save"></i>
          {t("save")}
        </button>

        <div className="dropdown">
          <button
            className="buttonsFeatures"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-box-arrow-down"></i> {t("export")}
            {renderPremiumIcon()}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleExport(false)}
                title="Télécharger en local"
              >
                {t("locally")}
                {renderPremiumIcon()}
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  handleQrCodeExport();
                  handleExport(true);
                }}
                title="Télécharger en ligne"
              >
                {t("qrCode")}
                {renderPremiumIcon()}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="d-flex justify-content-around mt-2">
        <div className="dropdown">
          <button
            className="buttonsFeatures"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-download"></i> {t("download")}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => handleCompile(false, false)}
                title="Télécharger en local"
              >
                {t("locally")}
              </button>
              <button
                className="dropdown-item"
                onClick={() =>
                  userPack === "Standard"
                    ? handlePremiumDialog("premiumDownloadRoadPlayer")
                    : handleCompile(true, false)
                }
                title="Transfert vers tablette"
              >
                {t("onRoadPlayer")}
                {renderPremiumIcon()}
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  handleCompile(false, true);
                  setShowQrCode(true);
                  setSelectedMarkerId("");
                  setSelectedMarkerToDelete("");
                }}
                title="Générer un QrCode"
              >
                {t("qrCode")}
              </button>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button
            className="buttonsFeatures"
            type="button"
            data-bs-toggle="dropdown"
            onClick={() =>
              userPack === "Standard" &&
              handlePremiumDialog("premiumImportProject")
            }
          >
            <i className="bi bi-arrow-down-circle"></i> {t("import")}
            <span className="text-warning ms-1" hidden={userPack === "Premium"}>
              <i className="bi bi-stars"></i>
            </span>
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowInputGPX(!showInputGPX);
                  setShowInputKML(false);
                  setShowInputGPXKml(false);
                }}
                title="Importer parcours"
              >
                {t("parcours")}
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowInputKML(!showInputKML);
                  setShowInputGPX(false);
                }}
                title="Importer KML"
              >
                {t("kml")}
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowInputGPXKml(!showInputGPXKml);
                  setShowInputKML(false);
                  setShowInputGPX(false);
                }}
                title="Importer GPX"
              >
                {t("gpx")}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <br />
        {qrCodeVisible && (
          <div className="text-center mt-4" ref={qrCodeRef}>
            <h6>{t("scanQrCode")}</h6>
            <QRCodeCanvas value={qrCodeUrl} size={100} />
            <br />
            <button
              className="btn btn-danger"
              onClick={() => setQrCodeVisible(false)}
            >
              {t("hideQrcode")}
            </button>
          </div>
        )}
      
      {showInputKML && !showInputGPX && (
        <div className="justify-content-around">
          <input
            className="form-control"
            type="file"
            accept=".kml"
            onChange={handleKmlUpload}
          />
        </div>
      )}

      {showInputGPX && !showInputKML && (
        <div className="justify-content-around">
          <input
            className="form-control"
            type="file"
            accept=".gpx"
            onChange={handleProjectUpload}
          />
        </div>
      )}

      {showInputGPXKml && (
        <div className="justify-content-around">
          <input
            className="form-control"
            type="file"
            accept=".gpx"
            onChange={handleGpxUpload}
          />
        </div>
      )}
    </div>
  );
};

export default ButtonsFeatures;
