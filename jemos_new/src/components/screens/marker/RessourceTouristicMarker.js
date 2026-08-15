import React from "react";
import MarkerImage from "./MarkerImage";
import MarkerVideo from "./MarkerVideo";
import MarkerAudio from "./MarkerAudio";
import { useTranslation } from "react-i18next";

const RessourceTouristicMarker = ({ marker }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="d-flex ms-4 text-start">
        <h6 className="ms-4" data-testid="title">
          {t("title")} :{" "}
          <span dangerouslySetInnerHTML={{ __html: marker.title }} />
        </h6>
      </div>
      <div className=" descriptionText d-flex text-start ms-5  ">
        <h6 className="mt-1" data-testid="description">
          {t("description")} :{" "}
          <span dangerouslySetInnerHTML={{ __html: marker.description }} />
        </h6>
      </div>
      <br />
      {marker.url && marker.url.length > 0 && (
        <div className="m-4">
          <label>URL: </label>
          <a
            href={marker.url}
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            {marker.url}
          </a>
        </div>
      )}
      {marker.image && marker.image.length > 0 && (
        <div className="m-4">
          <label>{t("image")}</label>
          <MarkerImage marker={marker} />
        </div>
      )}
      {marker.video && marker.video.length > 0 && (
        <div className="m-4">
          <label>{t("video")}</label>
          <MarkerVideo marker={marker} />
        </div>
      )}
      {marker.audio && marker.audio.length > 0 && (
        <div className="m-4">
          <label>{t("audio")}</label>
          <MarkerAudio marker={marker} />
        </div>
      )}
    </>
  );
};

export default RessourceTouristicMarker;
