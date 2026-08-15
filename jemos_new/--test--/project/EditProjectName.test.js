import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import EditProjectNameForm from "../../src/components/EditProjectNameForm";
import i18n from "i18next";

// Mock de la fonction de traductio
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
  init: jest.fn(),
}));

describe("EditProjectNameForm", () => {
  test("when we modified project's name", () => {
    jest.spyOn(console, "log");
    const saveModifiedName = jest.fn();
    const setEditingProject = jest.fn();
    const setModifiedName = jest.fn();

    const { getByLabelText, getByText } = render(
      <EditProjectNameForm
        saveModifiedName={saveModifiedName}
        editingProject={{ name: "Nom de projet" }}
        setEditingProject={setEditingProject}
        afficheMessageErreur={false}
        setModifiedName={setModifiedName}
      />
    );

    const nameInput = getByLabelText(i18n.t("projectName"));
    const saveButton = getByText(i18n.t("save"));

    fireEvent.change(nameInput, { target: { value: "Nouveau nom du projet" } });
    fireEvent.click(saveButton);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("jest: Modification réussite");
      console.log.mockRestore();
    });
  });

  test("when we canceled the modification", () => {
    const saveModifiedName = jest.fn();
    const setEditingProject = jest.fn();
    const setModifiedName = jest.fn();

    const { getByText } = render(
      <EditProjectNameForm
        saveModifiedName={saveModifiedName}
        editingProject={{ name: "Nom de projet" }}
        setEditingProject={setEditingProject}
        afficheMessageErreur={false}
        setModifiedName={setModifiedName}
      />
    );

    const cancelButton = getByText(i18n.t("cancel"));

    fireEvent.click(cancelButton);

    expect(setEditingProject).toHaveBeenCalledWith(null);
  });
});
