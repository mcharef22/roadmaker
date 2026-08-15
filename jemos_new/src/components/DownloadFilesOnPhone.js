import React, { useState } from "react";
import axios from "axios";
import { FILES_Route } from "./map/gpx/Resources";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../config";

const DownloadFilesOnPhone = () => {
  const { t } = useTranslation();
  const [fileNames, setFileNames] = useState([]);

  const handleDownload = (fileName) => {
    axios
      .get(apiUrl + FILES_Route + fileName, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const handleDownloadAll = () => {
    console.log("jest: Cliquer sur le boutton Tout télécharger");
    fileNames.forEach((fileName) => {
      handleDownload(fileName);
    });
  };

  const fetchFileNames = () => {
    axios.get(apiUrl + FILES_Route.slice(0, -1)).then((response) => {
      setFileNames(response.data);
    });
  };

  React.useEffect(() => {
    fetchFileNames();
  }, []);

  return (
    <div className="App d-flex align-items-center justify-content-center vh-100">
      {fileNames.length > 0 ? (
        <div className="d-flex flex-column align-items-center">
          <h6 className="mb-3">{t("downloadInstructions")}</h6>
          <button
            className="btn btn-success mb-2"
            onClick={handleDownloadAll}
            aria-label="Download"
          >
            {t("downloadAll")}
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <h6 className="mb-3">{t("fileNotAvailable")}</h6>
        </div>
      )}
    </div>
  );
};

export default DownloadFilesOnPhone;
