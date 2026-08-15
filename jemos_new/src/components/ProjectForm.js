import React from "react";
import { useState } from "react";
import axios from "axios";
import PaletteMaker from "./PaletteMaker";
import { useEffect } from "react";
import {
  PROJECT_OF_USER_ROUTE,
  PROJECT_ROUTE,
  parcoursTypes,
} from "./map/gpx/Resources";
import {
  ProjectNameError,
  EmptyProjectNameError,
  ProjectTypeError,
} from "./util/ProjectNameError";
import { useTranslation } from "react-i18next";
import { apiUrl } from "../config";

const ProjectForm = ({
  userData,
  checkName,
  afficheMessageErreur,
  checkEmptyName,
  afficheMessageErreurVide,
  checkEmptyType,
  afficheMessageErreurType,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [tag, setTag] = useState("");
  const [showPaletteMaker, setShowPaletteMaker] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projectsName, setProjectsName] = useState(null);
  const [afficheNewProjectMessage, setAfficheNewMessageProject] =
    useState(false);
  const [newProjectMessage, setNewProjectMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get(apiUrl + PROJECT_OF_USER_ROUTE + userData._id)
      .then((res) => {
        const projectsName = res.data.map((project) => project.name);
        setProjectsName(projectsName);
      })
      .catch((err) => {
        console.log("errreur" + err);
      });
  }, []);

  /**
   * Permet de créer un nouveau projet, si il y a un problème duranr la création, affiche un message d'erreur
   * @param {event} e - clic sur le bouton de création
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectsName && projectsName.includes(name)) {
      checkName();
      return;
    }
    if (!name) {
      console.log("jest: Empty name");
      checkEmptyName();
      return;
    }
    if (!type) {
      console.log("jest: Empty type");
      checkEmptyType();
      return;
    }
    console.log("jest: Création réussite");
    axios
      .post(apiUrl + PROJECT_ROUTE.slice(0, -1), {
        name: name,
        projectType: type,
        tag: tag,
        user: userData._id,
        dateOfCreation: Date.now(),
      })
      .then((res) => {
        setProjectId(res.data._id);
        setAfficheNewMessageProject(true);
        setNewProjectMessage(
          t("welcomeNewProject") + res.data.name + t("clickToAddSteps")
        );
        setTimeout(() => {
          setAfficheNewMessageProject(false);
        }, 5000);
        setShowPaletteMaker(true);
      })
      .catch((err) => {
        console.error("Erreur lors de la requête POST :", err);
      });
  };

  return (
    <div>
      {afficheMessageErreur ? <ProjectNameError /> : null}
      {afficheMessageErreurVide ? <EmptyProjectNameError /> : null}
      {afficheMessageErreurType ? <ProjectTypeError /> : null}
      {!showPaletteMaker ? (
        <form
          className="formStylePreset m-5 p-3"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <h2 className="mb-2"> {t("createACourse")} </h2>
          <input
            type="text"
            placeholder={t("courseNamePlaceholder")}
            aria-label="Nom du parcours"
            className="form-control"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <h2 className="mb-2">{t("trackName")}</h2>
          <input
            type="text"
            placeholder={t("trackNamePlaceholder")}
            aria-label="circuit-name"
            className="form-control"
            required
            onChange={(e) => {
              setTag(e.target.value);
            }}
          />
          <h2 className="labelType mt-5">{t("courseType")}</h2>
          <div className="btn-radio-type">
            <div>
              <input
                type="radio"
                name="type"
                aria-label="car"
                value={parcoursTypes.car}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
              <label className="m-4">{t("voiture")}</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                aria-label="cycle"
                value={parcoursTypes.cycle}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
              <label className="m-4">{t("velo")}</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                value={parcoursTypes.pedestrian}
                aria-label="pedestre"
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
              <label className="m-4">{t("pedestrian")}</label>
            </div>
            <div>
              <input
                type="radio"
                name="type"
                value={parcoursTypes.fast_forward}
                aria-label="fast_forward"
                onChange={(e) => {
                  setType(e.target.value);
                }}
              />
              <label className="m-4">{t("fastForward")}</label>
            </div>
          </div>
          <div className="btn-create_project text-center">
            <button
              type="submit"
              className="btnMenu"
              id="createProjectBtn"
              aria-label="create-form"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {t("createCourse")}
            </button>
          </div>
        </form>
      ) : (
        <>
          {afficheNewProjectMessage ? (
            <div className="alert alert-success m-1">{newProjectMessage}</div>
          ) : null}
          <PaletteMaker projectId={projectId} userData={userData} />
        </>
      )}
    </div>
  );
};

export default ProjectForm;
