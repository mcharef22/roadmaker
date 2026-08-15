const express = require("express");
const {
  setPOIs,
  getPOIs,
  getPOI,
  editPOI,
  deletePOI,
  getPOIsOfProject,
  deletePOIsOfProject,
  postPOIsOfProject,
  editPOIOfProject,
} = require("../controllers/poi.controller");
const router = express.Router();

router.get("/poi", getPOIs);
router.get("/poi/:id", getPOI);
router.post("/poi", setPOIs);
router.put("/poi/:id", editPOI);
router.delete("/poi/:id", deletePOI);
router.get("/poi/project/:id", getPOIsOfProject);
router.delete("/poi/project/:id", deletePOIsOfProject);
router.post("/poi/:projectId", postPOIsOfProject);
router.put("/poi/project/:id", editPOIOfProject);
module.exports = router;
