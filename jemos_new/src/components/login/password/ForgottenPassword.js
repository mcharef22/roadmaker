import React, { useState, useEffect } from "react";
import { apiUrl } from "../../../config";
import axios from "axios";
import DialogBox from "../../util/DialogBox";
import { useNavigate } from "react-router-dom";
import { MailTemplateHeader } from "../../util/mailHTML/MailTemplateHeader";
import { PwdResetMailBody } from "../../util/mailHTML/PwdResetMailBody";
import { MailHTMLTemplate } from "../../util/mailHTML/MailHTMLTemplate";
import { url } from "../../util/Util";
import { RESET_LINK } from "../../map/gpx/Resources";
import { useTranslation } from "react-i18next";
import { USERS_ROUTE, EMAIL_OF_USER_ROUTE } from "../../map/gpx/Resources";

function ForgottenPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();

  let lienReinitialisation = url + RESET_LINK + email;

  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Récupère les données des utilisateurs
   */
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl + USERS_ROUTE);
      const usersData = response.data;
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Envoie un mail de réinitialisation du mot de passe,
   * affiche une erreur si l'adresse e-mail n'appartient à aucun utilisateur
   * @param {event} e - clic sur le bouton d'envoi
   */

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = users.find((user) => user.email === email);

    if (user) {
      console.log("Email envoyé");

      const reinitialisationMailContent = `${MailTemplateHeader(
        "Réinitialisation du mot de passe"
      )}${PwdResetMailBody(user, lienReinitialisation)}`;

      const htmlMessage = MailHTMLTemplate(reinitialisationMailContent);

      axios
        .post(apiUrl + EMAIL_OF_USER_ROUTE, {
          email: email,
          subject: "Réinitialisation du mot de passe",
          message: htmlMessage,
        })
        .then((response) => {
          setMessage(t("resetPwdMailSend"));
        })
        .catch((error) => {
          console.error("Email error:", error);
        });
    } else {
      console.log("jest: Aucun utilisateur a été trouvé");
      DialogBox({
        text: "L'adresse e-mail n'appartient à aucun utilisateur",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  };

  return (
    <div className="App">
      <div className="AppContainer d-flex  flex-column align-items-center justify-content-center">
        {message ? (
          <div className="accessPage h-50 w-25 d-flex flex-column align-items-center justify-content-center">
            <h3 className="text-center">{message}</h3>
            <br />
            <div>
              <button
                className="btnBack mt-3"
                onClick={() => navigate("/Connexion")}
              >
                {t("backConnexionPage")}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="accessPage h-100">
              <h6 className="text-center">{t("writeEmail")}</h6>
              <input
                type="email"
                className="form-control mt-3"
                value={email}
                aria-label="Merci de saisir votre adresse mail"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <div className="d-flex flex-column align-items-center justify-content-center">
                <input
                  type="submit"
                  value={t("send")}
                  className="btnMenu mt-3"
                />
              </div>
            </form>
            <br />
            <div className="d-flex flex-column align-items-center justify-content-center">
              <button
                className="btnBack mt-3"
                onClick={() => navigate("/Connexion")}
              >
                {t("backConnexionPage")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgottenPassword;
