const { fileSettings } = require("../resources/resources");
const adb = require("adbkit");
const fs = require("fs");
const path = require("path");
const GPX = require("../models/upload.model");
const { Octokit } = require("@octokit/rest");
const GITHUB_OWNER = "mcharef22";
const ffmpeg = require("fluent-ffmpeg");
const zlib = require("zlib");

let count = 0;

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const { exec } = require("child_process");

/**
 * requete asynchrone pour vérifier la connexion
 * @param {string} res - reponse du serveur
 */
const verifieConnection = (req, res) => {
  const adbCommand = "adb devices";

  exec(adbCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(
        "Erreur lors de l'exécution de la commande adb devices",
        error,
      );
      res.status(500).json({ connected: false, error: error.message });
    } else {
      // Analyser la sortie de la commande pour vérifier si des appareils sont connectés
      const lines = stdout.split("\n");
      // La première ligne est l'en-tête, donc on la saute
      const connectedDevices = lines
        .slice(1)
        .filter((line) => line.trim() !== "");

      if (connectedDevices.length > 0) {
        res.status(200).json({ connected: true });
      } else {
        res.status(200).json({ connected: false });
      }
    }
  });
};

/**
 * requete asynchrone pour télécharger un fichier sur tablette ou serveur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 * @param {string} fileType - type de fichier
 */
const uploadFile = (req, res, fileType, sendToPhone) => {
  if (sendToPhone) {
    try {
      const blob = req.file.buffer;
      const fileName = req.file.originalname;
      const valideFileName = fileName.replace(/[\/\\:*?"<>| ]/g, "_");
      const localPath = `./uploads/${valideFileName}`;

      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      fs.writeFileSync(localPath, blob);

      // Utiliser le adb pour le push sur la tablette
      const adbCommand = `adb push ${localPath} ${fileSettings[fileType].adbPath}`;

      exec(adbCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          fs.unlinkSync(localPath);
          res.status(500).json({
            message: fileSettings[fileType].errorMessage,
          });
        } else {
          console.log(stdout);
          console.error(stderr);

          // supprimer le fichier après le push
          fs.unlinkSync(localPath);
          res.status(200).json({
            message: fileSettings[fileType].successMessage,
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: fileSettings[fileType].errorMessage,
      });
    }
  } else {
    try {
      const blob = req.file.buffer;
      const fileName = req.file.originalname;
      const valideFileName = fileName.replace(/[\/\\:*?"<>| ]/g, "_");
      const localPath = `./uploadFilesOnServer/${valideFileName}`;

      if (!fs.existsSync("./uploadFilesOnServer")) {
        fs.mkdirSync("./uploadFilesOnServer");
      }
      fs.writeFileSync(localPath, blob);

      res.status(200).json({
        message: "Fichier enregistré avec succès sur le serveur",
        filePath: localPath, // Vous pouvez renvoyer le chemin local du fichier si nécessaire
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Une erreur s'est produite lors de l'enregistrement du fichier sur le serveur",
      });
    }
  }
};

const uploadedFiles = []; // stocke les noms de fichiers téléchargés

/**
 * requete asynchrone pour télécharger un fichier GPX
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
const downloadFile = async (req, res) => {
  try {
    const blob = req.file.buffer;
    let fileName = `test${count}.gpx`;

    // vérifie si le nom de fichier existe déjà dans la liste, et si c'est le cas, réutilise le même nom
    if (uploadedFiles.includes(fileName)) {
      fileName = uploadedFiles.find((name) => name === fileName);
    } else {
      uploadedFiles.push(fileName);
      count++;
    }

    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const localPath = path.join(uploadDir, fileName);
    fs.writeFileSync(localPath, blob);

    // Créer une nouvelle instance du modèle GPX avec le chemin du fichier et l'enregistrer en base de données
    const gpx = await GPX.create({ nom: fileName, chemin: localPath });
    res.status(200).json({
      message: "Le fichier GPX a été enregistré avec succès sur le serveur.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de l'enregistrement du fichier GPX.",
    });
  }
};
/**
 * requete asynchrone pour télécharger un fichier vidéo sur le serveur
 */
const saveFileLocally = async (fileBuffer, fileName) => {
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  if (typeof uploadDir !== "string" || !fs.existsSync(uploadDir)) {
    throw new Error("Répertoire de téléchargement invalide :" + uploadDir);
  }
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);
  console.log("Fichier enregistré localement :", filePath);
  return filePath;
};

/**
 * requete asynchrone pour compresser un fichier vidéo
 * @param {string} inputFilePath - chemin du fichier d'entrée
 * @param {string} outputFilePath - chemin du fichier de sortie
 */

const compressFile = async (inputFilePath, outputFilePath, fileType) => {
  if (fileType === "gpx" || fileType === "") {
    // Si le fichier est de type GPX, on ne fait rien et on sort de la fonction.
    console.log("Aucune action pour le fichier GPX.");
    return; // Sortir de la fonction sans rien faire
  } else {
    let outputOptions = ["-preset ultrafast", "-b:v 2000k", "-b:a 128k"];
    let isCompressionSuccessful = false;
    while (!isCompressionSuccessful) {
      try {
        console.log("Compression avec FFmpeg en cours...");
        await ffmpeg(inputFilePath)
          .outputOptions(outputOptions)
          .output(outputFilePath)
          .run();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const compressedFileSizeInBytes = fs.statSync(outputFilePath).size;
        if (compressedFileSizeInBytes > 1000) {
          isCompressionSuccessful = true;
          console.log("Compression réussie.");
        } else {
          outputOptions = ["-preset ultrafast", "-b:v 1000k", "-b:a 64k"];
          console.log(
            "La taille du fichier compressé est trop petite. Nouvelle tentative de compression...",
          );
        }
      } catch (error) {
        console.error("Erreur lors de la compression du fichier :", error);
        throw new Error("Erreur lors de la compression du fichier");
      }
    }
  }
};

/**
 * requete asynchrone pour télécharger un fichier vidéo sur le serveur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */

const uploadFileToGithub = async (req, res) => {
  let tempFilePath, compressedFilePath;
  let fileType;
  try {
    const blob = req.file.buffer;
    const userEmail = req.body.userEmail || "";
    const userName = req.body.userName || "";
    const projectTitle = req.body.projectTitle || "";
    const markerId = req.body.markerId || "";
    const GITHUB_REPO = req.body.GITHUB_REPO;
    const fileName =
      userEmail +
      userName +
      projectTitle +
      (markerId ? markerId : "") +
      req.headers["x-filename"];
    fileType = fileName.split(".").pop(); // Déterminer le type de fichier

    console.log("Taille du fichier original :", blob.length);

    tempFilePath = await saveFileLocally(blob, fileName);
    compressedFilePath = path.join(
      __dirname,
      "..",
      "uploads",
      (fileType === "gpx" ? "" : "compressed_") + fileName,
    );

    // Compression du fichier selon le type
    await compressFile(tempFilePath, compressedFilePath, fileType);

    // Si le fichier est un .gpx, on s'arrête ici sans l'envoyer sur GitHub
    if (fileType === "gpx") {
      console.log(
        "Le fichier est de type GPX et ne sera pas envoyé sur GitHub.",
      );
      res.status(200).json({
        message:
          "Le fichier GPX a été sauvegardé localement sans être envoyé sur GitHub.",
      });
      return;
    }

    // Lire le fichier compressé
    const compressedFileBuffer = fs.readFileSync(compressedFilePath);
    console.log("Taille du fichier compressé :", compressedFileBuffer.length);

    let currentFile;
    try {
      currentFile = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: fileName,
      });
    } catch (notFoundError) {
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: fileName,
        message: "Création du fichier",
        content: compressedFileBuffer.toString("base64"),
      });
    }

    if (currentFile) {
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: fileName,
        message: "Mise à jour du fichier",
        content: compressedFileBuffer.toString("base64"),
        sha: currentFile.data.sha,
      });
    }

    res.status(200).json({
      message: "Le fichier a été mis à jour avec succès sur GitHub.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour du fichier.",
    });
  } finally {
    // Supprimer les fichiers temporaires après 30 secondes sauf gpx
    if (fileType !== "gpx") {
      setTimeout(() => {
        try {
          if (tempFilePath) fs.unlinkSync(tempFilePath);
          if (compressedFilePath) fs.unlinkSync(compressedFilePath);
          console.log("Fichiers supprimés avec succès après l'envoi à GitHub.");
        } catch (error) {
          console.error("Erreur lors de la suppression des fichiers :", error);
        }
      }, 30000);
    }
  }
};

/**
 * requete asynchrone pour télécharger un fichier KML sur GitHub
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
const uploadKMLFile = async (req, res) => {
  try {
    const blob = req.file.buffer;
    const userEmail = req.body.userEmail;
    const fileName = userEmail + req.headers["x-filename"];

    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localPath = path.join(uploadDir, fileName);

    let sha = null;

    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_OWNER,
        repo: "KMLFile",
        path: fileName,
      });
      sha = data.sha;
      console.log(`SHA récupéré : ${sha}`);
    } catch (notFoundError) {
      if (notFoundError.status !== 404) {
        console.error(
          "Erreur lors de la récupération du fichier :",
          notFoundError,
        );
        return res
          .status(500)
          .json({ message: "Erreur GitHub: " + notFoundError.message });
      }
      console.log("Le fichier n'existe pas encore, il va être créé.");
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: "KMLFile",
      path: fileName,
      message: sha ? "Mise à jour du fichier KML" : "Création du fichier KML",
      content: Buffer.from(blob).toString("base64"),
      sha: sha || undefined,
    });

    res.status(200).json({
      message: "Le fichier KML a été mis à jour avec succès sur GitHub.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur s'est produite lors de la mise à jour du fichier KML.",
    });
  }
};

module.exports = {
  verifieConnection,
  uploadFile,
  downloadFile,
  uploadFileToGithub,
  uploadKMLFile,
  // uploadVideoFile,
};
