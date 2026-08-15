const express = require("express");
const {
  getProjects,
  setProjects,
  editProject,
  deleteProject,
  getProjectsByUser,
  getProjectWithEditor,
} = require("../controllers/project.controller");
const router = express.Router();

router.get("/project", getProjects);

router.post("/project", setProjects);

router.put("/project/:id", editProject);

router.get("/project/:id", getProjectWithEditor);

router.delete("/project/:id", deleteProject);

router.get("/project/user/:id", getProjectsByUser);

module.exports = router;
