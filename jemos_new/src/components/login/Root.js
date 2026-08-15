import React, { useState } from "react";
import "./../../components/style/Connexion.css";
import Connexion from "./Connexion";
import Home from "../home/Home";
import Inscription from "./Inscription";
import { useTranslation } from "react-i18next";

const Root = () => {
  const [connexion, setConnexion] = useState(false);
  const [inscription, setInscription] = useState(false);
  const [home, setHome] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const { t, i18n } = useTranslation();
  const LOGO_IMG = "/rm_imgs/Logo.png";

  /**
   * Affiche la liste des parcours si il y a accès au User Data sinon affiche la page de connexion
   */

  const handleConnexion = () => {
    if (userData) {
      setHome(true);
    } else {
      setConnexion(true);
    }
  };

  /**
   * Affiche la liste des parcours si il y a accès au User Data sinon affiche la page d'inscription
   */
  const handleInscription = () => {
    if (userData) {
      setHome(true);
    } else {
      setInscription(true);
    }
  };

  if (connexion) {
    return <Connexion />;
  }
  if (inscription) {
    return <Inscription />;
  }

  if (home) {
    return <Home userData={userData} />;
  }

  return (
    <div className="App text-center">
      <div className="AppContainer d-flex  flex-column align-items-center justify-content-center ">
        <form className="accessPage">
          <div className="logoContainer mb-5 d-flex flex-column align-items-center justify-content-center">
            <img src={LOGO_IMG} alt="Logo RoadMaker" className="logo mb-4" />
          </div>

          <div className="buttonsContainer d-flex flex-column">
            {!userData && (
              <button
                aria-label="btn-inscription"
                className="btnMenu"
                onClick={() => handleInscription()}
              >
                {t("inscription")}
              </button>
            )}
            <button
              className="btnMenu mt-2"
              aria-label="btn-connexion"
              onClick={() => handleConnexion()}
            >
              {userData ? t("home") : t("connexion")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Root;
