import React, { useState, useEffect } from "react";
import "./../../components/style/Connexion.css";
import Connexion from "./Connexion";
import axios from "axios";
import DialogBox from "../util/DialogBox";
import { LoadingBox } from "../util/LoadingBox";
import {
  CONFIRMATION_LINK,
  EMAIL_OF_USER_ROUTE,
  USERS_ROUTE,
  USER_ROUTE,
} from "../map/gpx/Resources";
import { MailTemplateHeader } from "../util/mailHTML/MailTemplateHeader";
import { ConfRegistrationMailBody } from "../util/mailHTML/ConfiRegistrationMailBody";
import { MailHTMLTemplate } from "../util/mailHTML/MailHTMLTemplate";
import { url } from "../util/Util";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../../config";

function Inscription() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showConnexion, setShowConnexion] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  const LOGO_CONNEXION_IMG = "/rm_imgs/logo_connexion.png";

  useEffect(() => {
    /**
     * Récupère les données de l'utilisateur
     */
    const fetchUserData = async () => {
      try {
        const response = await axios.get(apiUrl + USERS_ROUTE);
        setUserData(response.data);
        console.log(userData);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur:",
          error,
        );
      }
    };

    fetchUserData();

    const urlParams = new URLSearchParams(window.location.search);
    const isConfirmed = urlParams.get("confirmed");
    if (isConfirmed === "true") {
      setConfirmed(true);
    }
  }, []);

  /**
   * Affiche la page de connexion si l'utilisateur si s'inscrit avec succès sinon affiche un message d'erreur
   *@param {event} e - clic sur le bouton pour valider l'inscription
   */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    LoadingBox({
      text: t("loadingInscription"),
      icon: "info",
    });
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      console.log("Adresse e-mail invalide");
      DialogBox({
        text: t("invalidEmail"),
        icon: "warning",
        confirmButtonText: "OK",
      });
      return; // Arrêtez le traitement si l'adresse email n'est pas valide
    }
    const emailExists =
      userData && userData.some((user) => user.email === email);

    if (emailExists) {
      console.log("Email déjà existant");
      DialogBox({
        text: t("existingEmail"),
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (password !== passwordConfirmation) {
      console.log("jest: Mots de passe différents");
      DialogBox({
        text: t("samePwdTwice"),
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (!password) {
      console.log("jest: Mot de passe requis");
      DialogBox({
        text: t("passwordRequired"),
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (!name) {
      console.log("jest: Nom requis");
      DialogBox({
        text: t("nameRequired"),
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      console.log("jest: Inscription réussie");

      axios
        .post(apiUrl + USER_ROUTE.slice(0, -1), {
          name: name,
          email: email,
          password: password,
          confirmed: confirmed,
          dateOfCreation: currentDate,
        })
        .then(async (response) => {
          const newUser = response.data;

          const stripeResponse = await axios.post(
            `${apiUrl}/user/stripe-customer`,
            {
              email: newUser.email,
            },
          );

          const customerId = stripeResponse.data.customerId;

          await axios.put(apiUrl + USER_ROUTE + newUser._id, {
            stripeCustomerId: customerId,
          });

          const confirmationLink = url + CONFIRMATION_LINK + newUser._id;

          const confirmationLinkMainContent = `${MailTemplateHeader(
            "Confirmation de votre inscription",
          )}${ConfRegistrationMailBody(newUser, confirmationLink)}`;

          const htmlMessage = MailHTMLTemplate(confirmationLinkMainContent);

          axios
            .post(apiUrl + EMAIL_OF_USER_ROUTE, {
              email: newUser.email,
              subject: "Confirmation de votre inscription",
              message: htmlMessage,
            })

            .then((response) => {
              console.log("Email sent:", response.status, response.text);
              DialogBox({
                text: t("successInscription"),
                icon: "success",
                confirmButtonText: "OK",
              });
              setShowConnexion(true);
            })
            .catch((error) => {
              console.error("Email error:", error);
              DialogBox({
                text: t("errorSendMail"),
                icon: "error",
                confirmButtonText: "OK",
              });
            });
        });
    }
  };

  if (showConnexion) {
    return <Connexion />;
  } else {
    return (
      <div className="App">
        <div className="AppContainer container d-flex  flex-column align-items-center justify-content-center ">
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="accessPageInscription d-flex flex-column align-items-center justify-content-center"
          >
            <img
              src={LOGO_CONNEXION_IMG}
              alt="Logo RoadMaker"
              className="logoInscription"
            />
            <div className="inputContainer">
              <h6 htmlFor="identifiant" className="labelConnexion">
                {t("name")}
              </h6>
              <input
                id="identifiant"
                type="text"
                className="inputInscription"
                value={name}
                required
                onChange={(e) => {
                  setName(e.target.value);
                }}
                aria-label="Identifiant"
              />
              <h6 htmlFor="email" className=" labelConnexion mt-3">
                {t("email")}
              </h6>
              <input
                id="email"
                type="email"
                className="inputInscription"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                aria-label="Email"
              />
              <h6 htmlFor="password" className="labelConnexion mt-3">
                {t("password")}
              </h6>
              <div className="passwordContainer d-flex align-items-center justify-content-center ">
                <input
                  type={showPassword ? "text" : "password"}
                  className="inputPasswordInscription "
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  aria-label="Mot-de-passe"
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
              <h6 htmlFor="confirm-password" className="labelConnexion mt-3">
                {t("confirmPassword")}
              </h6>

              <div className="passwordContainer d-flex align-items-center justify-content-center mb-5">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="inputPasswordInscription"
                  value={passwordConfirmation}
                  required
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                  }}
                  aria-label="confirm-password"
                />
                <button
                  className="buttonShowPassword"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </button>
              </div>
            </div>
            <div className=" buttonsContainerInscription d-flex flex-column  justify-content-center align-items-center">
              <button
                type="submit"
                className="btnMdpOublie px-5"
                aria-label="inscription-form"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                {t("signUp")}
              </button>
              <button
                className="btnBack mt-3 mb-3 px-5 py-2"
                onClick={(e) => {
                  setShowConnexion(true);
                }}
              >
                {t("backConnexionPage")}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Inscription;
