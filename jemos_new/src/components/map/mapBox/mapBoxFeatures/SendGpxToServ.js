import axios from "axios";
import { apiUrl } from "../../../../config";
import { DOWNLOAD_ROUTE } from "../../gpx/Resources";
const sendGpxToServ = ({ blob }) => {
  const formData = new FormData();
  formData.append("file", blob, "test.gpx"); //ajouter le fichier à un objet FormData

  console.log("1");

  // Envoyer la requête POST vers le backend en utilisant Axios
  axios
    .post(apiUrl + DOWNLOAD_ROUTE, formData)
    .then((response) => {
      console.log(
        "Le fichier a été envoyé avec succès au serveur:",
        response.data
      );
      // Effectuer d'autres actions avec la réponse du serveur, si nécessaire
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi du fichier au serveur:", error);
    });
};

export default sendGpxToServ;
