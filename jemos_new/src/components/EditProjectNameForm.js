import React from "react";
import { ProjectNameError } from "./util/ProjectNameError";
import { useTranslation } from "react-i18next";
const EditProjectNameForm = ({
  saveModifiedName,
  editingProject,
  setEditingProject,
  afficheMessageErreur,
  setModifiedName,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {afficheMessageErreur ? <ProjectNameError /> : null}
      <form onSubmit={saveModifiedName} className="form-inline mb-3">
        <div className="form-group">
          <label htmlFor="name" className="sr-only">
            {t("projectName")}{" "}
          </label>
          <input
            type="text"
            className="form-control mr-2"
            id="name"
            name="name"
            defaultValue={editingProject.name}
            onChange={(e) => {
              setModifiedName(e.target.value);
            }}
            required
          />
          <button type="submit" className="btn btn-primary">
            {t("save")}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={() => setEditingProject(null)}
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </>
  );
};
export default EditProjectNameForm;
