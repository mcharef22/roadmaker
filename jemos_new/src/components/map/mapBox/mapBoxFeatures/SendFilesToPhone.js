import axios from "axios";

export const sendFileToPhone = (blob, fileName, uploadUrl, fileType) => {
  const formData = new FormData();
  formData.append("file", blob, fileName);

  axios
    .post(uploadUrl, formData)
    .then((response) => {
      console.log(
        `Le fichier ${fileType} a été envoyé avec succès au serveur:`,
        response.data
      );
    })
    .catch((error) => {
      console.error(
        `Erreur lors de l'envoi du fichier ${fileType} au serveur:`,
        error
      );
    });
};

export const createBlob = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return blob;
};
