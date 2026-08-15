import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DialogBox from "../util/DialogBox";
import { useTranslation } from "react-i18next";
import { USER_ROUTE } from "../map/gpx/Resources";
import { apiUrl } from "../../config";

function ConfirmationPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isConfirmedParam = searchParams.get("confirmed");

    if (isConfirmedParam === "true") {
      setIsConfirmed(true);
      confirmUser(); // Appel à la fonction de confirmation d'utilisateur
    }
  }, [location.search]);

  const confirmUser = () => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");

    if (userId) {
      axios
        .put(apiUrl + USER_ROUTE + userId, {
          userId: userId,
          confirmed: true,
        })
        .then(() => {
          DialogBox({
            text: t("successConfirmationUser"),
            icon: "success",
            confirmButtonText: "OK",
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la confirmation de l'utilisateur:",
            error
          );
        });
    } else {
      console.error("Identifiant de l'utilisateur non trouvé dans l'URL");
    }
  };

  return (
    <div>
      {isConfirmed ? (
        <div className="App d-flex text-center align-items-center justify-content-center vh-100">
          <div className="accessPage h-75 d-flex flex-column text-center align-items-center justify-content-center">
            <h2 className="fw-bold">{t("messageConfirmationUser")}</h2>
            <p>{t("sentenceConfirmationUser")}</p>
            <button
              className="btnConnexion"
              onClick={() => navigate("/connexion")}
            >
              {t("continueConnexionPage")}
            </button>
          </div>
        </div>
      ) : (
        <div className="App d-flex text-center align-items-center justify-content-center vh-100">
          <div className="accessPage accessPage h-75 d-flex flex-column text-center align-items-center justify-content-center">
            <h2 className="fw-bold">{t("failureConfirmationUser")}</h2>
            <p>{t("sentenceFailureConfirmationUser")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmationPage;
