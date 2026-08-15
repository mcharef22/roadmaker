const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const gpxController = require("../controllers/upload.controller");

// const checkPushStatusRoute = (req, res) => {
//   res.json(Boolean(gpxController.pushCompleted));
// };
// router.get("/checkPushStatus", checkPushStatusRoute);

router.get("/checkTabletConnection", gpxController.verifieConnection);

router.post("/uploadGPX", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "gpx", true);
});

router.post("/uploadTxt", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "txt", true);
});

router.post("/uploadIcon", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "icon", true);
});

router.post("/uploadImage", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "image", true);
});

router.post("/uploadVideo", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "video", true);
});

router.post("/uploadAudio", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "audio", true);
});

router.post("/uploadImageQuiz", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "imageQuiz", true);
});

router.post("/download", upload.single("file"), gpxController.downloadFile); // Nouvelle route pour télécharger le fichier
router.post(
  "/uploadFileToGithub",
  upload.single("file"),
  gpxController.uploadFileToGithub
);
// router.post(
//   "/uploadVideoFile",
//   upload.single("file"),
//   gpxController.uploadVideoFile
// );

router.post(
  "/uploadKMLFile",
  upload.single("file"),
  gpxController.uploadKMLFile
);

module.exports = router;
