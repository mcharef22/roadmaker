import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ProjectsList from "../../src/components/home/ProjectsList";
import i18n from "i18next";

// Mock the translation function
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

// Mock other components if necessary
jest.mock("../../src/components/map/gpx/Resources", () => ({}));
jest.mock("../../src/components/home/ProjectsFilterOptions", () => "div");

describe("ProjectsList", () => {
  const projects = [
    {
      _id: "1",
      name: "Projet 1",
      projectType: "Voiture",
      tag: "Circuit A",
      dateOfCreation: "2023-06-25",
      dateOfModification: "2023-06-26",
      user: "user1",
    },
    {
      _id: "2",
      name: "Projet 2",
      projectType: "Velo",
      tag: "Circuit B",
      dateOfCreation: "2023-06-26",
      dateOfModification: "2023-06-27",
      user: "user1",
    },
  ];

  const handleProjectClick = jest.fn();
  const handleDeleteProject = jest.fn(() => jest.fn());
  const setEditingProject = jest.fn();
  const duplicateProject = jest.fn();
  const setSelectedProjects = jest.fn();
  const userData = {
    _id: "user1",
  };
  const saveModified = jest.fn();
  const setModifiedName = jest.fn();
  const setModifiedTag = jest.fn();
  const handleShowForm = jest.fn();
  const handleDeleteSelectedProjects = jest.fn();
  const theme = "light";

  let renderResult;

  beforeEach(() => {
    renderResult = render(
      <ProjectsList
        projects={projects}
        handleProjectClick={handleProjectClick}
        handleDeleteProject={handleDeleteProject}
        setEditingProject={setEditingProject}
        userData={userData}
        duplicateProject={duplicateProject}
        selectedProjects={[,]}
        setSelectedProjects={setSelectedProjects}
        saveModified={saveModified}
        setModifiedName={setModifiedName}
        setModifiedTag={setModifiedTag}
        editingProject={null}
        modifiedName=""
        modifiedTag=""
        handleShowForm={handleShowForm}
        deleteProjects=""
        handleDeleteSelectedProjects={handleDeleteSelectedProjects}
        theme={theme}
      />
    );
  });

  it("shows projects list", () => {
    const { getByLabelText } = renderResult;

    projects.forEach((project) => {
      const projectLink = getByLabelText(`Projet ${project.name}`);
      expect(projectLink).toBeInTheDocument();

      const deleteProjectButton = getByLabelText(
        `Supprimer le projet ${project.name}`
      );
      expect(deleteProjectButton).toBeInTheDocument();

      const editProjectButton = getByLabelText(
        `Modifier le projet ${project.name}`
      );
      expect(editProjectButton).toBeInTheDocument();

      const duplicateProjectButton = getByLabelText(
        `Dupliquer le projet ${project.name}`
      );
      expect(duplicateProjectButton).toBeInTheDocument();
    });
  });

  it("calls handleProjectClick when a project is clicked", () => {
    const { getByLabelText } = renderResult;

    projects.forEach((project) => {
      const projectLink = getByLabelText(`Projet ${project.name}`);
      fireEvent.click(projectLink);
      expect(handleProjectClick).toHaveBeenCalledWith(project);
    });
  });

  it("calls handleDeleteProject when delete button is clicked", () => {
    const { getByLabelText } = renderResult;
    const deleteProjectButton = getByLabelText("Supprimer le projet Projet 1");
    fireEvent.click(deleteProjectButton);
    expect(handleDeleteProject).toHaveBeenCalledWith("1", true);
  });

  it("calls duplicateProject when duplicate button is clicked", () => {
    const { getByLabelText } = renderResult;
    const duplicateProjectButton = getByLabelText(
      "Dupliquer le projet Projet 1"
    );
    fireEvent.click(duplicateProjectButton);
    expect(duplicateProject).toHaveBeenCalledWith(projects[0]);
  });

  it("deletes selected projects when checkBox is clicked", () => {
    const { getByLabelText, getByText } = renderResult;

    const checkbox1 = getByLabelText("checkbox-1");
    const checkbox2 = getByLabelText("checkbox-2");

    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    // Vérifiez que les projets sont sélectionnés
    expect(checkbox1.checked).toBe(true);
    expect(checkbox2.checked).toBe(true);

    // Cliquez sur le bouton de suppression
    const deleteButton = getByText(i18n.t("deletedSelection"));
    fireEvent.click(deleteButton);

    // Vérifiez que handleDeleteSelectedProjects est appelé
    expect(handleDeleteSelectedProjects).toHaveBeenCalled();
  });
});
