import React, { useState } from "react";
import "./../../components/style/Connexion.css";
import Inscription from "./Inscription";
import PaletteMaker from "../PaletteMaker";
import Home from "../home/Home";
import axios from "axios";
import Root from "./Root";
import DialogBox from "../util/DialogBox";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { USER_ROUTE } from "../map/gpx/Resources";
import { apiUrl } from "../../config";
function Connexion() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showInscription, setShowInscription] = useState(false);
  const [showAccueil, setShowAccueil] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const LOGO_CONNEXION_IMG = "/rm_imgs/logo_connexion.png";

  /**
   * Affiche la liste des projets si le User existe et que le mot de passe est correct
   * Sinon affiche un message d'erreur
   * @param {event} e - clic sur le bouton de connexion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: login,
        password,
      });

      const { user, token } = response.data;

      sessionStorage.setItem("token", token);

      console.log("jest: User exist");

      if (!user.stripeCustomerId) {
        const stripeResponse = await axios.post(
          `${apiUrl}/user/stripe-customer`,
          {
            email: user.email,
          },
        );

        const customerId = stripeResponse.data.customerId;

        await axios.put(apiUrl + USER_ROUTE + user._id, {
          stripeCustomerId: customerId,
        });

        const updatedUser = {
          ...user,
          stripeCustomerId: customerId,
        };

        setUserData(updatedUser);
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
      } else {
        setUserData(user);
        sessionStorage.setItem("userData", JSON.stringify(user));
      }

      setShowHub(true);
    } catch (error) {
      console.error(error);

      DialogBox({
        text: t("connexionError"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (showHub) {
    return <Home userData={userData} setUserData={setUserData} />;
  }
  if (showAccueil) {
    return <Root />;
  }
  if (showInscription === true) {
    return <Inscription />;
  }
  if (showPalette) {
    return <PaletteMaker />;
  } else {
    return (
      <div className="App">
        <div className="AppContainer d-flex flex-column align-items-center justify-content-center">
          <form
            className="accessPageConnexion d-flex flex-column align-items-center justify-content-center"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            {/* <h2 className="mb-5">{t("connexion")}</h2> */}
            <img
              src={LOGO_CONNEXION_IMG}
              alt="Logo RoadMaker"
              className="logoConnexion"
            />

            <div className="mt-3 d-flex flex-column align-items-center justify-content-center">
              <h6 className="labelConnexion">{t("username")}</h6>
              <input
                type="text"
                value={login}
                className="inputConnexion"
                required
                onChange={(e) => {
                  setLogin(e.target.value);
                }}
                aria-label="Identifiant"
              />
              <h6 className="labelConnexion mt-3">{t("password")}</h6>
              <div className="d-flex">
                <input
                  type={showPassword ? "text" : "password"}
                  className="inputPassword "
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  aria-label="Mot de passe"
                />
                <button
                  className="buttonShowPassword"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </button>
              </div>
            </div>
            <div className="buttonsContainerConnexion d-flex align-items-center justify-content-center">
              {" "}
              <input
                type="submit"
                value={t("logIn")}
                className="btnConnexion me-3"
                onClick={(e) => {
                  handleSubmit(e);
                }}
                aria-label="connexion-form"
              />
              <input
                type="submit"
                value={t("notRegistred")}
                className="btnConnexion"
                onClick={() => {
                  setShowInscription(true);
                }}
              />
            </div>
            <div className="buttonsInscription d-flex flex-column align-items-center justify-content-center">
              <input
                type="submit"
                value={t("forgotPassword")}
                className="btnMdpOublie mt-4 mb-2"
                onClick={() => navigate("/ForgottenPassword")}
              />
              <input
                type="submit"
                value={t("backToHub")}
                className="btnBack"
                onClick={(e) => {
                  setShowAccueil(true);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Connexion;
