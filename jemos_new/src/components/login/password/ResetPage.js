import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DialogBox from "../../util/DialogBox";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { USER_ROUTE } from "../../map/gpx/Resources";
import { apiUrl } from "../../../config";
import bcryptShim from "../../../shims/bcryptShim";

function ResetPage(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailFromQuery = searchParams.get("email");
  const email = props && props.email ? props.email : emailFromQuery;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldMdp, setOldMdb] = useState("");
  const [newMdp, setNewMdp] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");
  const [userId, setUserId] = useState("");

  const bcrypt = bcryptShim;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Effectuer une requête pour obtenir l'ID associé à l'e-mail
    axios
      .get(apiUrl + USER_ROUTE.slice(0, -1), {
        params: {
          email: email,
        },
      })
      .then((response) => {
        // Récupérer l'ID de l'utilisateur à partir de la réponse
        const user = response.data;
        setUserId(user._id);
        setOldMdb(user.password);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la recherche de l'ID de l'utilisateur:",
          error,
        );
      });
  }, [email]);

  /**
   * Permet de lancer la réinitialisation du mot de passe
   * @param {event} e - clic sur le bouton de validation
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newMdp !== confirmMdp) {
      DialogBox({
        text: t("samePwdTwice"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (bcrypt.compareSync(newMdp, oldMdp)) {
      DialogBox({
        text: t("oldPwd"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    axios
      .put(apiUrl + USER_ROUTE + userId, {
        password: newMdp,
      })
      .then((response) => {
        DialogBox({
          text: t("successResetMdp"),
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la réinitialisation du mot de passe:",
          error,
        );
      });
  };

  return (
    <div className="App d-flex align-items-center justify-content-center vh-100">
      <div className="accessPage h-50 w-25">
        <form onSubmit={handleSubmit}>
          <h6 className="text-center mt-2">{t("writeNewPwd")}</h6>
          <div className="input-group mt-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder={t("saisirMdpPlaceholder")}
              value={newMdp}
              required
              onChange={(e) => {
                setNewMdp(e.target.value);
              }}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className="bi bi-eye-slash"></i>
            </button>
          </div>
          <br />
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder={t("confirmPwdPlaceholder")}
              value={confirmMdp}
              required
              onChange={(e) => {
                setConfirmMdp(e.target.value);
              }}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className="bi bi-eye-slash"></i>
            </button>
          </div>
          <br />
          <div className="d-flex flex-column align-items-center justify-content-center">
            <input type="submit" value={t("send")} className="btnMenu mt-4" />
            <br />
            <button className="btnBack" onClick={() => navigate("/Connexion")}>
              {t("backConnexionPage")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPage;
