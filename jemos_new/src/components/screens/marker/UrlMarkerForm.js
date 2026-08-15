import React from "react";
import { useTranslation } from "react-i18next";

const UrlMarkerForm = ({ url, setUrl }) => {
  const { t } = useTranslation();
 
  return (
    <>
      <label className="lienUrl mt-4">{t("url")}</label>
      <input
        type="text"
        className="inputModifMarker"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        aria-label="input-video-url"
        placeholder="https://"
      />
      {url && (
        <button
          type="button"
          className="buttonDeleteUrl mt-3 mb-3 me-2"
          onClick={()=> setUrl("")}
          aria-label="delete"
        >
          <i className="bi bi-trash"></i>
        </button>
      )}
    </>
  );
};

export default UrlMarkerForm;
