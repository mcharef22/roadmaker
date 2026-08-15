const ProjectModel = require("../models/project.model");
const UserModel = require("../models/user.model");

/**
 * requete asynchrone pour récupérer les projets
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.getProjects = async (req, res) => {
  const projects = await ProjectModel.find();
  res.status(200).json(projects);
};

/**
 * requete asynchrone pour mettre en place des projets et les ajouter à un utilisateur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.setProjects = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }
  const project = await ProjectModel.create({
    name: req.body.name,
    projectType: req.body.projectType,
    tag: req.body.tag,
    colorProject: req.body.colorProject,
    originPOI: req.body.originPOI,
    destinationPOI: req.body.destinationPOI,
    //direction_result: req.body.direction_result,
    polyline_result: req.body.polyline_result,
    trkseg: req.body.trkseg,
    customNavigationPoints: req.body.customNavigationPoints,
    customIndicationsEdited: req.body.customIndicationsEdited,
    user: req.body.user,
    destinationSameAsOrigin: req.body.destinationSameAsOrigin,
    POIs: req.body.POIs,
    dateOfCreation: req.body.id,
    dateOfModification: req.body.dateOfModification,
  });

  await UserModel.findByIdAndUpdate(
    req.body.user,
    { $push: { projects: project._id } },
    { new: true }
  );
  res.status(200).json(project);
};

/**
 * requete asynchrone pour éditer un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.editProject = async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);
  if (!project) {
    res
      .status(404)
      .send({ message: "Project not found with id " + req.params.id });
  }

  const updateProject = await ProjectModel.findByIdAndUpdate(
    project,
    req.body,
    { new: true }
  );
  res.status(200).json(updateProject);
};

/**
 * requete asynchrone pour supprimer un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.deleteProject = async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  if (!project) {
    res
      .status(404)
      .send({ message: "Project not found with id " + req.params.id });
  }

  await ProjectModel.deleteOne({ _id: req.params.id });
  res
    .status(200)
    .json({ message: "Project" + project.id + " deleted successfully!" });
};

/**
 * requete asynchrone pour récupérer les projets d'un utilisateur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.getProjectsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const projects = await ProjectModel.find({ user: userId }).populate("user");
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

/**
 * requete asynchrone pour récupérer le projet avec l'éditeur
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.getProjectWithEditor = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await ProjectModel.findById(projectId)
      .populate("user")
      .populate("POIs");
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
