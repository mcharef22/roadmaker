import React from "react";
import { useTranslation } from "react-i18next";
import "../style/global.css";
import { useState } from "react";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const FRANCE_FLAG_IMG = "/rm_imgs/france.png";
  const UK_FLAG_IMG = "/rm_imgs/uk.png";
  const [selectedFlag, setSelectedFlag] = useState(
    i18n.language === "fr" ? FRANCE_FLAG_IMG : UK_FLAG_IMG
  );

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
    localStorage.setItem("language", event.target.value);
    setSelectedFlag(
      event.target.value === "fr" ? FRANCE_FLAG_IMG : UK_FLAG_IMG
    );
  };

  return (
    <div className="language-selector">
      <div className="dropdown">
        <img
          src={selectedFlag}
          alt="Selected language"
          className="w-75"
          data-bs-toggle="dropdown"
        />
        <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton1">
          <li>
            <button
              className="dropdown-item d-flex align-items-center"
              type="button"
              onClick={changeLanguage}
              value="fr"
              title="Français"
              aria-label="Français"
            >
              <img
                src={FRANCE_FLAG_IMG}
                alt="france"
                className="img_flag pe-none "
              />
              <span className="ms-2 pe-none">{t("french")}</span>
            </button>
            <button
              className="dropdown-item d-flex align-items-center"
              type="button"
              onClick={changeLanguage}
              value="en"
              title="English"
              aria-label="English"
            >
              <img src={UK_FLAG_IMG} alt="uk" className="img_flag pe-none" />

              <span className="ms-2 pe-none">{t("english")}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
