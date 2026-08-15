import React from "react";
import ButtonsFeatures from "./ButtonsFeatures";
import { useTranslation } from "react-i18next";

const MapBoxFeatures = ({
  handleCompile,
  customNavigationButtonClass,
  initialButtonNavigationsVisibility,
  showNavigationPanel,
  showCustomNavigationPanel,
  toggleNavigationPanel,
  toggleCustomNavigationPanel,
  sendDataToServ,
  showInputKML,
  setShowInputKML,
  handleKmlUpload,
  showInputGPX,
  setShowInputGPX,
  handleProjectUpload,
  handleExport,
  userPack,
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
  return (
    <>
      <div className="d-flex mb-4">
        <button
          className={` ${initialButtonNavigationsVisibility}`}
          onClick={() =>
            showNavigationPanel
              ? showNavigationPanel()
              : toggleNavigationPanel && toggleNavigationPanel()
          }
        >
          {t("initialDirections")}
        </button>
        <button
          className={`${customNavigationButtonClass}`}
          onClick={() =>
            showCustomNavigationPanel
              ? showCustomNavigationPanel()
              : toggleCustomNavigationPanel && toggleCustomNavigationPanel()
          }
        >
          {t("customDirections")}
        </button>
      </div>
      <div className="">
        <ButtonsFeatures
          sendDataToServ={sendDataToServ}
          handleCompile={handleCompile}
          userPack={userPack}
          handleExport={handleExport}
          setShowInputGPX={setShowInputGPX}
          setShowInputKML={setShowInputKML}
          showInputGPX={showInputGPX}
          showInputKML={showInputKML}
          handleKmlUpload={handleKmlUpload}
          handleProjectUpload={handleProjectUpload}
          handleGpxUpload={handleGpxUpload}
          setShowInputGPXKml={setShowInputGPXKml}
          showInputGPXKml={showInputGPXKml}
          setShowQrCode={setShowQrCode}
          setSelectedMarkerId={setSelectedMarkerId}
          setSelectedMarkerToDelete={setSelectedMarkerToDelete}
          setVisibleComponent={setVisibleComponent}
          projectDatas={projectDatas}
        />
      </div>
    </>
  );
};

export default MapBoxFeatures;
