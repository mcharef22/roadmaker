import React, { useState } from "react";
import ProjectsFilterOptions from "./ProjectsFilterOptions";
import {
  EmptyProjectNameError,
  ProjectNameError,
} from "../util/ProjectNameError";
import {
  formatDate,
  formatDateHour,
  sortByDate,
  filterItems,
} from "../util/Util";
import { useTranslation } from "react-i18next";

const ProjectsList = ({
  projects,
  handleProjectClick,
  handleDeleteProject,
  userData,
  saveModified,
  setModifiedName,
  setModifiedTag,
  editingProject,
  setEditingProject,
  afficheMessageErreur,
  afficheMessageErreurVide,
  modifiedName,
  modifiedTag,
  selectedProjects,
  setSelectedProjects,
  duplicateProject,
  handleShowForm,
  deleteProjects,
  handleDeleteSelectedProjects,
  theme,
}) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Tableau des types de projet
  const parcoursTypes = ["Voiture", "Velo", "Rando", "Retour_rapide"];

  const filteredParcours = filterItems(projects, [
    { key: "name", value: searchTerm },
    { key: "projectType", value: filterType },
    { key: "tag", value: filterTag },
  ]);

  const Parcours = sortByDate(
    filteredParcours,
    (user) => new Date(user.dateOfCreation),
    sortOrder
  );

  function getTranslationKey(projectType) {
    let translationKey;
    switch (projectType) {
      case "Voiture":
        translationKey = "voiture";
        break;
      case "Velo":
        translationKey = "velo";
        break;
      case "Rando":
        translationKey = "rando";
        break;
      case "Retour_rapide":
        translationKey = "retour_Rapide";
        break;
      default:
        translationKey = projectType; // or any default translation key
        break;
    }
    return translationKey;
  }

  return (
    <>
      <ProjectsFilterOptions
        filterType={filterType}
        setFilterType={setFilterType}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        parcoursTypes={parcoursTypes}
        projects={projects}
        userData={userData}
      />

      <ul className="list-group">
        {afficheMessageErreur ? <ProjectNameError /> : null}
        {afficheMessageErreurVide ? <EmptyProjectNameError /> : null}
        <div className="list-group-item list-group-item-action">
          <div className="row">
            <div className="col">
              <span className="text-info">{t("parcours")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("circuit")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("creationDate")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("modifDate")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("type")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info">{t("actions")}</span>
            </div>
            <div className="col d-flex justify-content-center">
              <span className="text-info"> {t("selected")}</span>
            </div>
          </div>
        </div>
        {Parcours.filter((project) => project.user === userData._id).map(
          (project, index) => (
            <div
              href="#"
              className="list-group-item list-group-item-action"
              key={`${project._id}-${index}`}
              onClick={() => {
                handleProjectClick(project);
                setEditingProject(null);
              }}
              aria-label={`Projet ${project.name}`}
            >
              🏁
              <div className="row" key={project._id}>
                <div className="col ">
                  {editingProject && editingProject._id === project._id ? (
                    <input
                      className="form-control"
                      type="text"
                      defaultValue={modifiedName ? modifiedName : project.name}
                      onChange={(e) => setModifiedName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <b>{project.name}</b>
                  )}
                </div>
                <div className="col 1 d-flex justify-content-center">
                  {editingProject && editingProject._id === project._id ? (
                    <input
                      className="form-control"
                      type="text"
                      defaultValue={modifiedTag ? modifiedTag : project.tag}
                      onChange={(e) => setModifiedTag(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <b>{project.tag}</b>
                  )}
                </div>
                <div className="col d-flex justify-content-center">
                  <span>
                    <b>{formatDate(project.dateOfCreation, i18n.language)}</b>
                  </span>
                </div>
                <div className="col d-flex justify-content-center">
                  <span>
                    <b>
                      {formatDateHour(
                        project.dateOfModification,
                        i18n.language
                      )}
                    </b>
                  </span>
                </div>
                <div className="col d-flex justify-content-center">
                  <span>
                    <b>{t(getTranslationKey(project.projectType))}</b>
                  </span>
                </div>
                <div className="col">
                  {editingProject && editingProject._id === project._id ? (
                    <div className="col">
                      <button
                        className="btn btn-danger btn-margin"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(null);
                        }}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        className="btn btn-primary "
                        onClick={(e) => {
                          e.stopPropagation();
                          saveModified(e);
                          setEditingProject(null);
                        }}
                      >
                        {t("accept")}
                      </button>
                    </div>
                  ) : (
                    <div className="col d-flex justify-content-center">
                      <div className="buttons">
                        <button
                          className="btn btn-outline-primary me-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateProject(project);
                          }}
                          aria-label={`Dupliquer le projet ${project.name}`}
                        >
                          🗐
                        </button>
                        <button
                          className="btn btn-outline-primary me-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingProject(project);
                            setModifiedName(project.name);
                            setModifiedTag(project.tag);
                          }}
                          aria-label={`Modifier le projet ${project.name}`}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={handleDeleteProject(project._id, true)}
                          aria-label={`Supprimer le projet ${project.name}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col d-flex justify-content-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    aria-label={`checkbox-${project._id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedProjects.includes(project._id)) {
                        setSelectedProjects(
                          selectedProjects.filter((id) => id !== project._id)
                        );
                      } else {
                        setSelectedProjects([...selectedProjects, project._id]);
                      }
                      console.log(selectedProjects.length);
                    }}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </ul>
      <div className="d-flex flex-row">
        <button
          className={
            theme === "bg-white"
              ? "btn btn-outline-primary mt-4"
              : "btn btn-primary mt-4"
          }
          onClick={handleShowForm}
        >
          {t("newCourse")}
        </button>
        {selectedProjects.length > 0 && (
          <button
            className={deleteProjects}
            onClick={handleDeleteSelectedProjects}
          >
            {t("deletedSelection")}
          </button>
        )}
      </div>
    </>
  );
};

export default ProjectsList;
