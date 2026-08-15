import React from "react";
import QRCode from "qrcode.react";
import { url } from "../util/Util";
import { DOWNLOAD_FILES_ON_PHONE_LINK } from "./gpx/Resources";

const QrCode = () => {
  const DownloadPageUrl = url + DOWNLOAD_FILES_ON_PHONE_LINK;
  const qrCodeValue = DownloadPageUrl;

  return (
    <div className="QrCodeContainer d-flex align-items-center justify-content-center ">
      <QRCode value={qrCodeValue} />
    </div>
  );
};

export default QrCode;
