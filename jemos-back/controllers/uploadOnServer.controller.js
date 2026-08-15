const path = require("path");
const fs = require("fs");

/**
 * requete pour récupere les noms de fichiers sur le serveur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */

const getFiles = (req, res) => {
  const folderPath = "./uploadFilesOnServer";

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      res.status(500).json({
        message:
          "Une erreur s'est produite lors de la récupération des fichiers",
      });
    } else {
      const fileNames = files.map((file) => path.basename(file));
      res.json(fileNames);
    }
  });
};

/**
 * Requete pour supprimer le dossier uploadsFilesOnServer
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */

const deleteRepository = (req, res) => {
  console.log("Requête DELETE reçue");
  const folderPath = path.join(__dirname, "../uploadFilesOnServer");

  if (fs.existsSync(folderPath)) {
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          message:
            "Une erreur s'est produite lors de la suppression du dossier",
        });
      } else {
        res.status(200).json({
          message: "Le dossier a été supprimé avec succès",
        });
      }
    });
  } else {
    res.status(200).json({
      message: "Le dossier n'existe pas",
    });
  }
};

/**
 * requete pour récupere les fichiers sur le serveur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */

const downloadFiles = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../uploadFilesOnServer", fileName);

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({
        message: "Une erreur s'est produite lors du téléchargement du fichier.",
      });
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
        } else {
          const folderPath = path.join(__dirname, "../uploadFilesOnServer");
          fs.rmdir(folderPath, (err) => {});
        }
      });
    }
  });
};

module.exports = {
  getFiles,
  downloadFiles,
  deleteRepository,
};
