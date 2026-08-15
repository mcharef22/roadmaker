const POIsModel = require("../models/poi.model");
const ProjectModel = require("../models/project.model");
const mongoose = require("mongoose");

/**
 * requete asynchrone pour permettre de récupérer les POIs
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.getPOIs = async (req, res) => {
  const pois = await POIsModel.find();
  res.status(200).json(pois);
};

/**
 * requete asynchrone qui va permettre de récupérer un POI
 * @param {string} req
 * @param {string} res
 */
module.exports.getPOI = async (req, res) => {
  const poi = await POIsModel.findById(req.params.id);
  if (!poi) {
    res.status(404).send({ message: "POI not found with id " + req.params.id });
  }
  res.status(200).json(poi);
};

/**
 * requete asynchrone pour set les POIs et va les ajouter à un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.setPOIs = async (req, res) => {
  const poi = await POIsModel.create({
    id: new Date(req.body.id).getTime(),
    position: req.body.position,
    type: req.body.type,
    title: req.body.title,
    distanceToMarker: req.body.distanceToMarker,
    subType: req.body.subType,
    icon: req.body.icon,
    description: req.body.description,
    image: req.body.image,
    iconImage: req.body.iconImage,
    video: req.body.video,
    audio: req.body.audio,
    imageName: req.body.imageName,
    videoName: req.body.videoName,
    audioName: req.body.audioName,
    iconName: req.body.iconName,
    iconNameWithoutBorder: req.body.iconNameWithoutBorder,
    markerToDownload: req.body.markerToDownload,
    stopover: req.body.stopover,
    Project_id: req.body.Project_id,
    checkAudio: req.body.checkAudio,
    resourceArray: req.body.resourceArray,
    mainResource: req.body.mainResource,
    checkAcces: req.body.checkAcces,
    draggable: req.body.draggable,
    triggerType: req.body.triggerType,
    triggerDistance: req.body.triggerDistance,
    url: req.body.url,
    openQuestionArray: req.body.openQuestionArray,
    qcmArray: req.body.qcmArray,
    qcmImageArray: req.body.qcmImageArray,
    dateOfCreation: new Date(req.body.id).getTime(),
  });

  await ProjectModel.findByIdAndUpdate(
    req.body.Project_id,
    {
      $push: { POIs: poi._id },
    },
    { new: true }
  );

  res.status(200).json(poi);
};

/**
 * Requete asynchrone pour modifier un POI
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.editPOI = async (req, res) => {
  const poi = await POIsModel.findById(req.params.id);
  if (!poi) {
    res.status(404).send({ message: "POI not found with id " + req.params.id });
  }

  const updatePOI = await POIsModel.findByIdAndUpdate(poi, req.body, {
    new: true,
  });
  res.status(200).json(updatePOI);
};

/**
 * requete asynchrone pour modifier un POI d'un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 * @returns {string} - retourne une reponse du serveur
 */
module.exports.editPOIOfProject = async (req, res) => {
  try {
    const poi = await POIsModel.findById(req.params.poiId);
    if (!poi) {
      return res
        .status(404)
        .send({ message: "POI not found with id " + req.params.poiId });
    }

    // Vérifier que le POI appartient au projet spécifié
    if (poi.Project_id.toString() !== req.params.projectId) {
      return res
        .status(400)
        .send({ message: "POI does not belong to the specified project" });
    }

    const updatePOI = await POIsModel.findByIdAndUpdate(
      req.params.poiId,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatePOI);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error editing POI" });
  }
};

/**
 * requete asynchrone pour supprimer un POI
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 * @returns {string} - retourne une reponse du serveur
 */
module.exports.deletePOI = async (req, res) => {
  try {
    const objectId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!objectId) {
      return res.status(400).send({ message: "Invalid ID" });
    }

    const poi = await POIsModel.findById(req.params.id);
    if (!poi) {
      return res.status(404).send({ message: "POI not found" });
    }

    await POIsModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "POI deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting POI" });
  }
};

/**
 * requete asynchrone pour récupérer les POIs d'un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.getPOIsOfProject = async (req, res) => {
  const pois = await POIsModel.find({ Project_id: req.params.id });
  res.status(200).json(pois);
};

/**
 * requete asynchrone pour supprimer les POIs d'un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.deletePOIsOfProject = async (req, res) => {
  const pois = await POIsModel.find({ Project_id: req.params.id });
  if (!pois) {
    res
      .status(404)
      .send({ message: "POIs not found with id " + req.params.id });
  }

  await POIsModel.deleteMany({ Project_id: req.params.id });
  res.status(200).json({ message: "POIs deleted successfully!" });
};

/**
 * requete asynchrone pour ajouter des POIs à un projet
 * @param {string} req - requete
 * @param {string} res - reponse du serveur
 */
module.exports.postPOIsOfProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const poiData = req.body;

    // verifiez si le projet existe
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Le projet n'a pas été trouvé." });
    }

    // mettre a jour id de projet les les poi ajoutés
    poiData.Project_id = projectId;

    // Créez le POI
    const createdPOI = await POIsModel.create(poiData);

    // mettre à jour la liste des POIs dans le modèle Project
    await ProjectModel.findByIdAndUpdate(
      projectId,
      { $push: { POIs: createdPOI._id } },
      { new: true }
    );

    res.status(201).json(createdPOI);
  } catch (error) {
    console.error("Erreur lors de la création du POI :", error);
    res.status(500).json({ message: "Erreur lors de la création du POI." });
  }
};
