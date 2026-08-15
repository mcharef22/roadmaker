const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const gpxController = require("../controllers/upload.controller");
const fileOnServerController = require("../controllers/uploadOnServer.controller");

router.get("/files/:fileName", fileOnServerController.downloadFiles);

router.get("/files", fileOnServerController.getFiles);

router.delete("/deleteRepository", fileOnServerController.deleteRepository);

router.post("/uploadGPXOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "gpx", false);
});

router.post("/uploadTxtOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "txt", false);
});

router.post("/uploadIconOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "icon", false);
});

router.post("/uploadImageOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "image", false);
});

router.post("/uploadVideoOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "video", false);
});

router.post("/uploadAudioOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "audio", false);
});

router.post("/uploadImageQuizOnServer", upload.single("file"), (req, res) => {
  gpxController.uploadFile(req, res, "imageQuiz", false);
});
module.exports = router;
